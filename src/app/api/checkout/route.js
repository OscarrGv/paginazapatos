import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { cartItems, userInfo, shippingMethod, total } = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    // Enviar correo de confirmación de pedido usando nodemailer
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS && userInfo?.email) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        const itemsHtml = cartItems.map(item => 
          `<tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} (Talla: ${item.size}) x${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
          </tr>`
        ).join('');

        const shippingHtml = shippingMethod ? `
          <tr>
            <td style="padding: 10px; text-align: right; font-weight: bold;">Envío (${shippingMethod.name}):</td>
            <td style="padding: 10px; text-align: right;">$${shippingMethod.price.toFixed(2)}</td>
          </tr>
        ` : '';

        const mailOptions = {
          from: `"Calzado del Pueblo" <${process.env.EMAIL_USER}>`,
          to: userInfo.email,
          subject: `Confirmación de Pedido - Calzado del Pueblo`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #d4af37; text-align: center;">¡Gracias por tu pedido, ${userInfo.name}!</h2>
              <p style="font-size: 16px;">Hemos recibido tu solicitud de pedido correctamente. A continuación te mostramos el desglose de tu compra simulada.</p>
              
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                  <tr style="background: #f5f5f5;">
                    <th style="padding: 10px; text-align: left;">Producto</th>
                    <th style="padding: 10px; text-align: right;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  ${shippingHtml}
                  <tr>
                    <td style="padding: 10px; text-align: right; font-weight: bold;">Total Pagado:</td>
                    <td style="padding: 10px; text-align: right; font-weight: bold; color: #d4af37; font-size: 1.2rem;">$${total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>

              <div style="text-align: center; margin-top: 30px;">
                <p style="background-color: #f8f9fa; color: #333; padding: 12px 24px; border-radius: 5px; font-weight: bold; display: inline-block; border: 1px solid #ddd;">
                  Simulación de Pago Exitosa ✅
                </p>
              </div>

              <p style="text-align: center; color: #666; font-size: 14px; margin-top: 30px;">Si tienes alguna duda, responde a este correo.</p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log('Correo de confirmación enviado a:', userInfo.email);
      } catch (emailError) {
        console.error('Error enviando correo de confirmación:', emailError);
      }
    }

    // Retornamos directamente la URL de éxito para simular que el pago ya se completó
    return NextResponse.json({ 
      success: true, 
      url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/?success=true`
    });
  } catch (error) {
    console.error('Error procesando checkout:', error);
    return NextResponse.json({ error: 'Error interno en el servidor.' }, { status: 500 });
  }
}
