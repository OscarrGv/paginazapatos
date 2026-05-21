import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import sql, { initDB } from "@/lib/db";

export async function PUT(request, { params }) {
  try {
    await initDB();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const email = session.user.email.toLowerCase();
    const isAdmin = email.includes("admin") || email === "oscar@calzadodelpueblo.com";

    if (!isAdmin) {
      return NextResponse.json({ error: "Acceso denegado. Se requiere administrador." }, { status: 403 });
    }

    const { id } = params;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json({ error: "El estado es requerido" }, { status: 400 });
    }

    await sql`
      UPDATE service_orders 
      SET status = ${status} 
      WHERE id = ${id}
    `;

    return NextResponse.json({
      success: true,
      message: `Solicitud de servicio ${id} actualizada a estado ${status}`
    });
  } catch (error) {
    console.error("Error al actualizar estado del servicio:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
