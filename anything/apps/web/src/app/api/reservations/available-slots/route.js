import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get("date");

    if (!date) {
      return Response.json(
        { error: "Date parameter is required" },
        { status: 400 },
      );
    }

    const resDate = new Date(date);
    const dayOfWeek = resDate.getDay(); // 0=Sun, 5=Fri, 6=Sat

    if (dayOfWeek === 6) {
      return Response.json({
        slots: [],
        closed: true,
        message: "Closed on Saturday",
      });
    }

    // Generate all 30-min slots
    const openHour = 11;
    const closeHour = dayOfWeek === 5 ? 15 : 22;
    const closeMinute = dayOfWeek === 5 ? 30 : 30;
    const maxPerSlot = 10;

    const allSlots = [];
    for (let h = openHour; h <= closeHour; h++) {
      for (let m = 0; m < 60; m += 30) {
        const timeInMinutes = h * 60 + m;
        const closeInMinutes = closeHour * 60 + closeMinute;
        if (timeInMinutes > closeInMinutes) break;
        allSlots.push(
          `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
        );
      }
    }

    // Get counts for each slot on this date
    const existing = await sql(
      `SELECT reservation_time, COUNT(*) as total 
       FROM reservations 
       WHERE reservation_date = $1 AND status != 'cancelled'
       GROUP BY reservation_time`,
      [date],
    );

    const countMap = {};
    for (const row of existing) {
      countMap[row.reservation_time] = parseInt(row.total);
    }

    // Check if date is today and filter past times
    const now = new Date();
    const isToday = resDate.toDateString() === now.toDateString();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const slots = allSlots.map((time) => {
      const [h, m] = time.split(":").map(Number);
      const slotMinutes = h * 60 + m;
      const count = countMap[time] || 0;
      const isPast = isToday && slotMinutes <= currentMinutes + 30; // need at least 30 min lead time

      return {
        time,
        available: !isPast && count < maxPerSlot,
        remaining: Math.max(0, maxPerSlot - count),
        isPast,
      };
    });

    return Response.json({ slots, closed: false });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return Response.json(
      { error: "Failed to fetch available slots" },
      { status: 500 },
    );
  }
}
