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

    const orders = await sql`
      SELECT * FROM orders 
      ORDER BY created_at DESC
    `;

    const orderItems = await sql`SELECT * FROM order_items`;
    const orderItemsMap = {};
    orderItems.forEach(item => {
      if (!orderItemsMap[item.order_id]) {
        orderItemsMap[item.order_id] = [];
      }
      orderItemsMap[item.order_id].push(item);
    });

    const ordersWithItems = orders.map(order => ({
      ...order,
      items: orderItemsMap[order.id] || []
    }));

    return NextResponse.json({
      success: true,
      orders: ordersWithItems
    });
  } catch (error) {
    console.error("Error al obtener órdenes para administración:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
