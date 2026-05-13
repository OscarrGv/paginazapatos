import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
  try {
    const services = await sql`SELECT * FROM services`;
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching services' }, { status: 500 });
  }
}
