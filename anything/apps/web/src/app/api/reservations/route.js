import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get("date");
    const status = url.searchParams.get("status");

    let query = "SELECT * FROM reservations WHERE 1=1";
    const params = [];
    let paramIndex = 1;

    if (date) {
      query += ` AND reservation_date = $${paramIndex}`;
      params.push(date);
      paramIndex++;
    }

    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    query += " ORDER BY reservation_date ASC, reservation_time ASC";

    const rows = await sql(query, params);
    return Response.json({ reservations: rows });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return Response.json(
      { error: "Failed to fetch reservations" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      full_name,
      email,
      phone,
      party_size,
      reservation_date,
      reservation_time,
      special_requests,
    } = body;

    // Validation
    if (!full_name || !phone || !reservation_date || !reservation_time) {
      return Response.json(
        { error: "Name, phone, date, and time are required" },
        { status: 400 },
      );
    }

    if (party_size < 1 || party_size > 20) {
      return Response.json(
        { error: "Party size must be between 1 and 20" },
        { status: 400 },
      );
    }

    // Check date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const resDate = new Date(reservation_date);
    if (resDate < today) {
      return Response.json(
        { error: "Cannot book a date in the past" },
        { status: 400 },
      );
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(reservation_time)) {
      return Response.json(
        { error: "Invalid time format. Use HH:MM" },
        { status: 400 },
      );
    }

    // Check opening hours (11:00-22:30 Sun-Thu, 11:00-15:30 Fri)
    const hour = parseInt(reservation_time.split(":")[0]);
    const minute = parseInt(reservation_time.split(":")[1]);
    const timeInMinutes = hour * 60 + minute;
    const dayOfWeek = resDate.getDay(); // 0=Sun, 5=Fri, 6=Sat

    if (dayOfWeek === 6) {
      return Response.json(
        { error: "We are closed on Saturday" },
        { status: 400 },
      );
    }

    const openTime = 11 * 60; // 11:00
    const closeTime = dayOfWeek === 5 ? 15 * 60 + 30 : 22 * 60 + 30; // 15:30 Fri, 22:30 otherwise

    if (timeInMinutes < openTime || timeInMinutes > closeTime) {
      const closeStr = dayOfWeek === 5 ? "15:30" : "22:30";
      return Response.json(
        { error: `Reservations are available between 11:00 and ${closeStr}` },
        { status: 400 },
      );
    }

    // Check capacity — max 10 reservations per 30-min slot
    const slotStart = `${String(hour).padStart(2, "0")}:${minute < 30 ? "00" : "30"}`;
    const existingCount = await sql(
      `SELECT COUNT(*) as total FROM reservations 
       WHERE reservation_date = $1 
       AND reservation_time >= $2 
       AND reservation_time < $3
       AND status != 'cancelled'`,
      [
        reservation_date,
        slotStart,
        `${String(hour).padStart(2, "0")}:${minute < 30 ? "30" : "59"}`,
      ],
    );

    if (parseInt(existingCount[0].total) >= 10) {
      return Response.json(
        { error: "This time slot is fully booked. Please try another time." },
        { status: 409 },
      );
    }

    const result = await sql(
      `INSERT INTO reservations (full_name, email, phone, party_size, reservation_date, reservation_time, special_requests, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'confirmed')
       RETURNING *`,
      [
        full_name,
        email || null,
        phone,
        party_size || 2,
        reservation_date,
        reservation_time,
        special_requests || null,
      ],
    );

    return Response.json({ reservation: result[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating reservation:", error);
    return Response.json(
      { error: "Failed to create reservation" },
      { status: 500 },
    );
  }
}
