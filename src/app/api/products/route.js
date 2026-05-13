import { NextResponse } from 'next/server';
import sql, { initDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    try { await initDB(); } catch (e) { console.warn("DB init skipped:", e.message); }

    const products = await sql`SELECT * FROM products`;
    
    // Transform sizes from string to array
    const formattedProducts = products.map(product => ({
      ...product,
      sizes: product.sizes.split(',').map(s => parseInt(s.trim()))
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching products: ' + error.message }, { status: 500 });
  }
}
