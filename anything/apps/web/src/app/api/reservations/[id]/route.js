import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const rows = await sql(`SELECT * FROM reservations WHERE id = $1`, [id]);

    if (rows.length === 0) {
      return Response.json({ error: "Reservation not found" }, { status: 404 });
    }

    return Response.json({ reservation: rows[0] });
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return Response.json(
      { error: "Failed to fetch reservation" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    const allowedFields = [
      "full_name",
      "email",
      "phone",
      "party_size",
      "reservation_date",
      "reservation_time",
      "special_requests",
      "status",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        setClauses.push(`${field} = $${paramIndex}`);
        values.push(body[field]);
        paramIndex++;
      }
    }

    if (setClauses.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    setClauses.push(`updated_at = NOW()`);
    values.push(id);

    const query = `UPDATE reservations SET ${setClauses.join(", ")} WHERE id = $${paramIndex} RETURNING *`;
    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: "Reservation not found" }, { status: 404 });
    }

    return Response.json({ reservation: result[0] });
  } catch (error) {
    console.error("Error updating reservation:", error);
    return Response.json(
      { error: "Failed to update reservation" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const result = await sql(
      `UPDATE reservations SET status = 'cancelled', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id],
    );

    if (result.length === 0) {
      return Response.json({ error: "Reservation not found" }, { status: 404 });
    }

    return Response.json({ reservation: result[0] });
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    return Response.json(
      { error: "Failed to cancel reservation" },
      { status: 500 },
    );
  }
}
