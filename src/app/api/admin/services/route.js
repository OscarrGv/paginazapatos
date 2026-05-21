import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import sql, { initDB } from "@/lib/db";

export async function GET(request) {
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

    const serviceOrders = await sql`
      SELECT * FROM service_orders 
      ORDER BY created_at DESC
    `;

    const serviceItems = await sql`SELECT * FROM service_order_items`;
    const serviceItemsMap = {};
    serviceItems.forEach(item => {
      if (!serviceItemsMap[item.service_order_id]) {
        serviceItemsMap[item.service_order_id] = [];
      }
      serviceItemsMap[item.service_order_id].push(item);
    });

    const serviceOrdersWithItems = serviceOrders.map(so => ({
      ...so,
      items: serviceItemsMap[so.id] || []
    }));

    return NextResponse.json({
      success: true,
      services: serviceOrdersWithItems
    });
  } catch (error) {
    console.error("Error al obtener servicios para administración:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
