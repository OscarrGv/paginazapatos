import { neon } from '@neondatabase/serverless';

export const sql = process.env.DATABASE_URL 
  ? neon(process.env.DATABASE_URL) 
  : async () => { throw new Error("DATABASE_URL is not set in environment variables. Por favor crea el archivo .env con DATABASE_URL.") };

export async function initDB() {
  if (!process.env.DATABASE_URL) return;
  
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT NOT NULL,
      description TEXT,
      sizes TEXT NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      is_verified INTEGER DEFAULT 0,
      verification_token TEXT
    )
  `;

  const counts = await sql`SELECT COUNT(*) as count FROM products`;
  if (parseInt(counts[0].count) === 0) {
    const productsToSeed = [
      { name: 'Huarache Clásico Tejido', price: 85.00, image: 'https://images.unsplash.com/photo-1616866168339-399066cbab8e?ixlib=rb-4.0.3&w=800&q=80', desc: 'Huaraches tradicionales mexicanos tejidos a mano por artesanos veracruzanos. Piel 100% natural.', sizes: '23,24,25,26,27,28' },
      { name: 'Sandalia de Piel Fina', price: 95.00, image: 'https://images.unsplash.com/photo-1595991209266-5e04278dc71f?ixlib=rb-4.0.3&w=800&q=80', desc: 'Sandalia artesanal con acabados finos y detalles autóctonos que resaltan nuestra cultura.', sizes: '22,23,24,25,26,27' },
      { name: 'Bota Artesanal de Trabajo', price: 120.00, image: 'https://images.unsplash.com/photo-1580982545800-47b2bd3c5c96?ixlib=rb-4.0.3&w=800&q=80', desc: 'Botas de piel genuina, cosidas a mano y diseñadas para durar toda la vida con el mantenimiento adecuado.', sizes: '25,26,27,28,29,30' },
      { name: 'Huarache Cruzado', price: 89.00, image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?ixlib=rb-4.0.3&w=800&q=80', desc: 'Un diseño cómodo y fresco con correas de cuero entrelazadas al estilo tradicional.', sizes: '24,25,26,27,28' }
    ];

    for (const prod of productsToSeed) {
      await sql`INSERT INTO products (name, price, image, description, sizes) VALUES (${prod.name}, ${prod.price}, ${prod.image}, ${prod.desc}, ${prod.sizes})`;
    }

    await sql`
      INSERT INTO services (name, description, price) VALUES 
      ('Cambio de suela', 'Reemplazo completo de la suela desgastada', 25.00),
      ('Reparación de costuras', 'Arreglo de costuras rotas o desgastadas', 15.00),
      ('Reemplazo de cordones', 'Cambio de cordones por unos nuevos', 8.00),
      ('Limpieza profunda', 'Limpieza completa y restauración de color', 12.00),
      ('Reparación de cremallera', 'Arreglo o reemplazo de cremallera dañada', 18.00),
      ('Refuerzo de talón', 'Refuerzo interno para mayor durabilidad', 10.00)
    `;
  }
}

export default sql;
