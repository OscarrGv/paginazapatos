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

    const email = session.user.email;

    // 1. Obtener órdenes de productos
    const orders = await sql`
      SELECT * FROM orders 
      WHERE user_email = ${email} 
      ORDER BY created_at DESC
    `;

    // Obtener ítems de productos y mapear a sus órdenes correspondientes
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

    // 2. Obtener órdenes de servicios
    const serviceOrders = await sql`
      SELECT * FROM service_orders 
      WHERE user_email = ${email} 
      ORDER BY created_at DESC
    `;

    // Obtener ítems de servicios y mapear
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
      orders: ordersWithItems,
      services: serviceOrdersWithItems
    });
  } catch (error) {
    console.error("Error al obtener historial de usuario:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
