import { neon } from '@neondatabase/serverless';
import { PRODUCT_SEED } from './src/lib/db.js';
import dotenv from 'dotenv';

dotenv.config();

async function updateNeonDB() {
  const sql = neon(process.env.DATABASE_URL);
  console.log('Borrando productos antiguos...');
  await sql`DELETE FROM products`;

  console.log('Insertando productos con nuevas imagenes locales...');
  for (const prod of PRODUCT_SEED) {
    await sql`INSERT INTO products (name, price, image, description, sizes) VALUES (${prod.name}, ${prod.price}, ${prod.image}, ${prod.description}, ${prod.sizes})`;
  }
  
  console.log('¡Base de datos Neon actualizada!');
}

updateNeonDB().catch(console.error);
