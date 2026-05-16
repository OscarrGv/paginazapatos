import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const { cartItems, userInfo, shippingMethod, total } = await request.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 });
    }

    // Mapear los productos del carrito al formato que pide Stripe
    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: 'mxn',
        product_data: {
          name: `${item.name} (Talla: ${item.size})`,
          images: [item.image.startsWith('http') ? item.image : `${process.env.NEXTAUTH_URL}${item.image}`],
        },
        unit_amount: Math.round(item.price * 100), // Stripe cobra en centavos
      },
      quantity: item.quantity,
    }));

    // Añadir el costo de envío como un line item adicional si existe
    if (shippingMethod && shippingMethod.price > 0) {
      lineItems.push({
        price_data: {
          currency: 'mxn',
          product_data: {
            name: `Envío: ${shippingMethod.name}`,
          },
          unit_amount: Math.round(shippingMethod.price * 100),
        },
        quantity: 1,
      });
    }

    // Crear la sesión de checkout en Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: userInfo?.email || undefined,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/?canceled=true`,
      metadata: {
        userId: userInfo?.id || 'guest',
      }
    });

    return NextResponse.json({ 
      success: true, 
      url: session.url // Stripe genera esta URL a la que debemos redirigir
    });
  } catch (error) {
    console.error('Error en Stripe:', error);
    return NextResponse.json({ error: 'Error procesando el pago con Stripe' }, { status: 500 });
  }
}
