import { NextResponse } from 'next/server';
import sql, { initDB } from '@/lib/db';
import { sendServiceConfirmationMail } from '@/lib/mail';

export async function POST(request) {
  try {
    await initDB();
    const { selectedServices, total, userInfo } = await request.json();

    if (!selectedServices || selectedServices.length === 0) {
      return NextResponse.json({ error: 'No se seleccionaron servicios' }, { status: 400 });
    }

    if (!userInfo || !userInfo.email) {
      return NextResponse.json({ error: 'Usuario no autenticado o correo no proporcionado' }, { status: 400 });
    }

    // 1. Obtener ID del usuario registrado
    let userId = null;
    try {
      const users = await sql`SELECT id FROM users WHERE email = ${userInfo.email}`;
      if (users && users.length > 0) {
        userId = users[0].id;
      }
    } catch (dbErr) {
      console.warn('No se pudo encontrar el usuario en la BD para el servicio:', dbErr.message);
    }

    // 2. Insertar el registro principal del servicio
    const serviceOrderResult = await sql`
      INSERT INTO service_orders (user_id, user_email, total, status)
      VALUES (${userId}, ${userInfo.email}, ${total}, 'requested')
      RETURNING id
    `;

    if (!serviceOrderResult || serviceOrderResult.length === 0) {
      throw new Error('No se pudo registrar el pedido de servicio en la base de datos.');
    }

    const serviceOrderId = serviceOrderResult[0].id;

    // 3. Insertar los detalles del servicio
    for (const service of selectedServices) {
      await sql`
        INSERT INTO service_order_items (service_order_id, service_id, service_name, service_price)
        VALUES (${serviceOrderId}, ${service.id}, ${service.name}, ${service.price})
      `;
    }

    // 4. Enviar correo de confirmación usando nuestro mail helper
    const serviceOrderData = {
      id: serviceOrderId,
      total: total
    };

    await sendServiceConfirmationMail({
      serviceOrder: serviceOrderData,
      items: selectedServices,
      user: userInfo
    });

    return NextResponse.json({ 
      success: true, 
      serviceOrderId: serviceOrderId,
      message: 'Cotización registrada y correo enviado exitosamente.' 
    });
  } catch (error) {
    console.error('Error enviando cotización:', error);
    return NextResponse.json({ error: 'Error procesando la solicitud' }, { status: 500 });
  }
}
