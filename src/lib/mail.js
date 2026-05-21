import nodemailer from 'nodemailer';

let testAccount = null;
let cachedTransporter = null;

async function getTransporter() {
  const hasGmailCreds = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

  if (hasGmailCreds) {
    if (!cachedTransporter || cachedTransporter._isTest) {
      cachedTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      cachedTransporter._isTest = false;
      console.log('📬 Transporter SMTP de Gmail configurado.');
    }
    return cachedTransporter;
  }

  // Fallback to Ethereal test account in development
  if (!cachedTransporter || !cachedTransporter._isTest) {
    try {
      if (!testAccount) {
        testAccount = await nodemailer.createTestAccount();
      }
      cachedTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      cachedTransporter._isTest = true;
      console.log('🧪 Transporter de pruebas (Ethereal Mail) creado.');
    } catch (err) {
      console.error('Error creando cuenta SMTP de prueba:', err);
      // Fallback a un transportador de consola simulado para que no truene la app
      return {
        sendMail: async (options) => {
          console.log('\n==================================================');
          console.log('📧 SIMULACIÓN DE CORREO (FALLBACK CRÍTICO):');
          console.log(`Para: ${options.to}`);
          console.log(`Asunto: ${options.subject}`);
          console.log('Cuerpo HTML:', options.html);
          console.log('==================================================\n');
          return { messageId: 'console-simulated-id' };
        }
      };
    }
  }

  return cachedTransporter;
}

export async function sendOrderConfirmationMail({ order, items, user }) {
  try {
    const transporter = await getTransporter();
    
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 12px 10px; border-bottom: 1px solid #f2f2f2; color: #333333;">
          <div style="font-weight: bold;">${item.name}</div>
          <div style="font-size: 13px; color: #888888;">Talla: ${item.size}</div>
        </td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #f2f2f2; text-align: center; color: #555555;">x${item.quantity}</td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #f2f2f2; text-align: right; font-weight: bold; color: #333333;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const cardHint = order.payment_method === 'card' 
      ? '💳 Tarjeta de Crédito/Débito (Simulado)' 
      : order.payment_method === 'paypal' 
        ? '🅿️ PayPal (Simulado)' 
        : '🏦 Transferencia / OXXO (Simulado)';

    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 30px 15px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.05); border: 1px solid #eaeaea;">
          <!-- Header -->
          <div style="background-color: #1a1a1a; padding: 40px 20px; text-align: center; border-bottom: 3px solid #d4af37;">
            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 2px;">CALZADO DEL PUEBLO</h1>
            <p style="color: #d4af37; margin: 5px 0 0 0; font-size: 13px; font-weight: 600; letter-spacing: 1px;">EL ALMA DE MÉXICO EN TU CAMINAR</p>
          </div>
          
          <!-- Body -->
          <div style="padding: 30px 25px;">
            <div style="text-align: center; margin-bottom: 25px;">
              <span style="font-size: 50px;">🎉</span>
              <h2 style="color: #1a1a1a; margin: 10px 0 5px 0; font-size: 22px; font-weight: 700;">¡Gracias por tu compra, ${user.name}!</h2>
              <p style="color: #666666; margin: 0; font-size: 15px;">Tu pedido ha sido confirmado y está siendo procesado.</p>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 25px 0;" />
            
            <!-- Detalles de Pedido -->
            <div style="margin-bottom: 25px;">
              <h3 style="color: #1a1a1a; font-size: 16px; font-weight: 700; margin-top: 0; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Detalles de la Orden</h3>
              <table style="width: 100%; font-size: 14px; color: #555555;">
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; width: 140px;">Referencia:</td>
                  <td style="padding: 5px 0;">CP-${order.id.toString().padStart(5, '0')}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-weight: bold;">Fecha:</td>
                  <td style="padding: 5px 0;">${new Date().toLocaleDateString('es-MX')}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-weight: bold;">Método de Pago:</td>
                  <td style="padding: 5px 0;">${cardHint}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-weight: bold;">Método de Envío:</td>
                  <td style="padding: 5px 0;">${order.shipping_name}</td>
                </tr>
              </table>
            </div>

            <!-- Tabla de items -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <thead>
                <tr style="background-color: #fcfcfc;">
                  <th style="padding: 12px 10px; border-bottom: 2px solid #eaeaea; text-align: left; font-weight: bold; color: #666666; font-size: 13px;">Producto</th>
                  <th style="padding: 12px 10px; border-bottom: 2px solid #eaeaea; text-align: center; font-weight: bold; color: #666666; font-size: 13px; width: 60px;">Cant.</th>
                  <th style="padding: 12px 10px; border-bottom: 2px solid #eaeaea; text-align: right; font-weight: bold; color: #666666; font-size: 13px; width: 100px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding: 12px 10px; text-align: right; font-weight: bold; color: #666666; font-size: 14px;">Envío:</td>
                  <td style="padding: 12px 10px; text-align: right; font-weight: bold; color: #333333; font-size: 14px;">$${order.shipping_price.toFixed(2)}</td>
                </tr>
                <tr style="background-color: #fafafa;">
                  <td colspan="2" style="padding: 15px 10px; text-align: right; font-weight: 800; color: #1a1a1a; font-size: 16px; border-top: 1px solid #eaeaea;">Total Pagado:</td>
                  <td style="padding: 15px 10px; text-align: right; font-weight: 800; color: #d4af37; font-size: 18px; border-top: 1px solid #eaeaea;">$${order.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <div style="background-color: #fcf8e3; border: 1px solid #fbeed5; color: #c09853; padding: 15px; border-radius: 8px; text-align: center; font-size: 14px; font-weight: 600; margin-bottom: 25px;">
              ✅ Pago Simulado Correctamente. Tu pedido está en camino.
            </div>
            
            <p style="color: #888888; font-size: 12px; text-align: center; line-height: 1.5; margin: 30px 0 0 0;">
              Si tienes alguna pregunta o requieres asistencia adicional, por favor responde a este correo o contáctanos mediante nuestro chat en línea.<br/>
              <b>Calzado del Pueblo S.A. de C.V.</b>
            </p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Calzado del Pueblo" <${process.env.EMAIL_USER || 'no-reply@calzadodelpueblo.com'}>`,
      to: user.email,
      subject: `Confirmación de Pedido - Calzado del Pueblo [CP-${order.id.toString().padStart(5, '0')}]`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    if (transporter._isTest) {
      console.log(`\n📬 [TEST EMAIL] Vista previa del correo de pedido enviada: ${nodemailer.getTestMessageUrl(info)}\n`);
    } else {
      console.log(`📬 Correo de confirmación de pedido enviado a ${user.email}`);
    }
    return info;
  } catch (error) {
    console.error('Error enviando correo de confirmación de pedido:', error);
    return null;
  }
}

export async function sendServiceConfirmationMail({ serviceOrder, items, user }) {
  try {
    const transporter = await getTransporter();
    
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 12px 10px; border-bottom: 1px solid #f2f2f2; color: #333333; font-weight: bold;">
          ${item.name}
        </td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #f2f2f2; text-align: right; font-weight: bold; color: #d4af37;">
          $${item.price.toFixed(2)}
        </td>
      </tr>
    `).join('');

    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9; padding: 30px 15px; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.05); border: 1px solid #eaeaea;">
          <!-- Header -->
          <div style="background-color: #1a1a1a; padding: 40px 20px; text-align: center; border-bottom: 3px solid #d4af37;">
            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 2px;">TALLER ARTESANAL</h1>
            <p style="color: #d4af37; margin: 5px 0 0 0; font-size: 13px; font-weight: 600; letter-spacing: 1px;">CALZADO DEL PUEBLO - VIDA NUEVA A TU CALZADO</p>
          </div>
          
          <!-- Body -->
          <div style="padding: 30px 25px;">
            <div style="text-align: center; margin-bottom: 25px;">
              <span style="font-size: 50px;">🛠️</span>
              <h2 style="color: #1a1a1a; margin: 10px 0 5px 0; font-size: 22px; font-weight: 700;">¡Solicitud de Reparación Recibida, ${user.name}!</h2>
              <p style="color: #666666; margin: 0; font-size: 15px;">Tu cotización ha sido registrada. A continuación te explicamos los siguientes pasos.</p>
            </div>
            
            <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 25px 0;" />
            
            <!-- Detalles de Cotización -->
            <div style="margin-bottom: 25px;">
              <h3 style="color: #1a1a1a; font-size: 16px; font-weight: 700; margin-top: 0; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Resumen de Cotización</h3>
              <table style="width: 100%; font-size: 14px; color: #555555;">
                <tr>
                  <td style="padding: 5px 0; font-weight: bold; width: 140px;">No. de Solicitud:</td>
                  <td style="padding: 5px 0;">REP-${serviceOrder.id.toString().padStart(5, '0')}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-weight: bold;">Fecha:</td>
                  <td style="padding: 5px 0;">${new Date().toLocaleDateString('es-MX')}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; font-weight: bold;">Estado:</td>
                  <td style="padding: 5px 0; color: #d4af37; font-weight: bold;">Registrado / Pendiente de Recepción</td>
                </tr>
              </table>
            </div>

            <!-- Tabla de servicios -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <thead>
                <tr style="background-color: #fcfcfc;">
                  <th style="padding: 12px 10px; border-bottom: 2px solid #eaeaea; text-align: left; font-weight: bold; color: #666666; font-size: 13px;">Servicio Solicitado</th>
                  <th style="padding: 12px 10px; border-bottom: 2px solid #eaeaea; text-align: right; font-weight: bold; color: #666666; font-size: 13px; width: 120px;">Costo Estimado</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr style="background-color: #fafafa;">
                  <td style="padding: 15px 10px; text-align: right; font-weight: 800; color: #1a1a1a; font-size: 16px; border-top: 1px solid #eaeaea;">Total Estimado:</td>
                  <td style="padding: 15px 10px; text-align: right; font-weight: 800; color: #d4af37; font-size: 18px; border-top: 1px solid #eaeaea;">$${serviceOrder.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <!-- Instrucciones de entrega -->
            <div style="background-color: #f7f9fa; border-left: 4px solid #d4af37; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h4 style="color: #1a1a1a; margin-top: 0; margin-bottom: 10px; font-weight: bold; font-size: 15px;">📍 ¿Cómo entregar tu calzado?</h4>
              <ol style="padding-left: 20px; margin: 0; font-size: 14px; line-height: 1.6; color: #555555;">
                <li style="margin-bottom: 8px;"><b>Empaqueta tu calzado</b> de forma segura en una bolsa o caja.</li>
                <li style="margin-bottom: 8px;">Adjunta una nota dentro con tu nombre y el número de cotización: <b>REP-${serviceOrder.id.toString().padStart(5, '0')}</b>.</li>
                <li style="margin-bottom: 8px;">Entrégalo en nuestro taller de restauración física en:
                  <br/><i>📍 Avenida del Zapatero #123, Colonia Centro, Veracruz.</i>
                </li>
                <li>Nuestro maestro zapatero validará las costuras y piel en físico. El total final se te confirmará al recibir los zapatos.</li>
              </ol>
            </div>
            
            <p style="color: #888888; font-size: 12px; text-align: center; line-height: 1.5; margin: 30px 0 0 0;">
              Gracias por confiar en las manos expertas de los artesanos de Calzado del Pueblo.<br/>
              <b>Taller de Restauración y Mantenimiento</b>
            </p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"Taller Calzado del Pueblo" <${process.env.EMAIL_USER || 'no-reply@calzadodelpueblo.com'}>`,
      to: user.email,
      subject: `Confirmación de Reparación - Calzado del Pueblo [REP-${serviceOrder.id.toString().padStart(5, '0')}]`,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    if (transporter._isTest) {
      console.log(`\n📬 [TEST EMAIL] Vista previa del correo de reparación enviada: ${nodemailer.getTestMessageUrl(info)}\n`);
    } else {
      console.log(`📬 Correo de cotización de servicio enviado a ${user.email}`);
    }
    return info;
  } catch (error) {
    console.error('Error enviando correo de confirmación de servicio:', error);
    return null;
  }
}
