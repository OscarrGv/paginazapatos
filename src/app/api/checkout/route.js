import { NextResponse } from 'next/server';
import sql, { initDB } from '@/lib/db';
import { sendOrderConfirmationMail } from '@/lib/mail';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await initDB();
    const { cartItems, userInfo, shippingMethod, total, paymentMethod, cardInfo } = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    if (!userInfo || !userInfo.email) {
      return NextResponse.json({ error: 'Usuario no autenticado o correo no proporcionado' }, { status: 400 });
    }

    // 1. Obtener ID del usuario si está registrado en la base de datos
    let userId = null;
    try {
      const users = await sql`SELECT id FROM users WHERE email = ${userInfo.email}`;
      if (users && users.length > 0) {
        userId = users[0].id;
      }
    } catch (dbErr) {
      console.warn('No se pudo encontrar el usuario en la BD, continuando como invitado:', dbErr.message);
    }

    // 2. Insertar el pedido principal
    const shippingName = shippingMethod?.name || 'Estándar';
    const shippingPrice = shippingMethod?.price || 0;
    const finalPaymentMethod = paymentMethod || 'card';

    const orderResult = await sql`
      INSERT INTO orders (user_id, user_email, shipping_name, shipping_price, payment_method, total, status)
      VALUES (${userId}, ${userInfo.email}, ${shippingName}, ${shippingPrice}, ${finalPaymentMethod}, ${total}, 'pending')
      RETURNING id
    `;

    if (!orderResult || orderResult.length === 0) {
      throw new Error('No se pudo registrar la orden principal en la base de datos.');
    }

    const orderId = orderResult[0].id;

    // 3. Insertar los ítems de la compra
    for (const item of cartItems) {
      await sql`
        INSERT INTO order_items (order_id, product_id, product_name, product_price, size, quantity)
        VALUES (${orderId}, ${item.id}, ${item.name}, ${item.price}, ${item.size}, ${item.quantity})
      `;
    }

    // 4. Enviar correo de confirmación de pedido usando nuestro mail helper
    const orderData = {
      id: orderId,
      shipping_name: shippingName,
      shipping_price: shippingPrice,
      payment_method: finalPaymentMethod,
      total: total
    };

    await sendOrderConfirmationMail({
      order: orderData,
      items: cartItems,
      user: userInfo
    });

    // Retornamos éxito e ID del pedido
    return NextResponse.json({ 
      success: true, 
      orderId: orderId,
      message: 'Pedido confirmado exitosamente.'
    });
  } catch (error) {
    console.error('Error procesando checkout:', error);
    return NextResponse.json({ error: 'Error interno en el servidor.' }, { status: 500 });
  }
}
