import Database from 'better-sqlite3';
import path from 'path';

const hasRemoteDatabase = Boolean(process.env.DATABASE_URL);

let cachedNeonClient = null;
let sqliteClient = null;
let initInProgress = null;
let initCompleted = false;

export const PRODUCT_SEED = [
  { name: 'Huarache Clásico Tejido', price: 85.00, image: '/huarache-clasico.png', description: 'Huaraches tradicionales mexicanos tejidos a mano por artesanos veracruzanos. Piel 100% natural.', sizes: '23,24,25,26,27,28' },
  { name: 'Sandalia de Piel Fina', price: 95.00, image: '/sandalia-fina.png', description: 'Sandalia artesanal con acabados finos y detalles autóctonos que resaltan nuestra cultura.', sizes: '22,23,24,25,26,27' },
  { name: 'Bota Artesanal de Trabajo', price: 120.00, image: '/bota-trabajo.png', description: 'Botas de piel genuina, cosidas a mano y diseñadas para durar toda la vida con el mantenimiento adecuado.', sizes: '25,26,27,28,29,30' },
  { name: 'Huarache Cruzado', price: 89.00, image: '/huarache-cruzado.png', description: 'Un diseño cómodo y fresco con correas de cuero entrelazadas al estilo tradicional.', sizes: '24,25,26,27,28' }
];

export const SERVICE_SEED = [
  { name: 'Cambio de suela', description: 'Reemplazo completo de la suela desgastada', price: 25.00 },
  { name: 'Reparación de costuras', description: 'Arreglo de costuras rotas o desgastadas', price: 15.00 },
  { name: 'Reemplazo de cordones', description: 'Cambio de cordones por unos nuevos', price: 8.00 },
  { name: 'Limpieza profunda', description: 'Limpieza completa y restauración de color', price: 12.00 },
  { name: 'Reparación de cremallera', description: 'Arreglo o reemplazo de cremallera dañada', price: 18.00 },
  { name: 'Refuerzo de talón', description: 'Refuerzo interno para mayor durabilidad', price: 10.00 }
];

async function getNeonClient() {
  if (!hasRemoteDatabase) return null;
  if (cachedNeonClient) return cachedNeonClient;

  try {
    const { neon } = await import('@neondatabase/serverless');
    cachedNeonClient = neon(process.env.DATABASE_URL);
    return cachedNeonClient;
  } catch (error) {
    console.warn('No se pudo cargar Neon, se usará SQLite local:', error.message);
    return null;
  }
}

function getSqliteClient() {
  if (!sqliteClient) {
    const sqlitePath = process.env.VERCEL
      ? '/tmp/paginazapatos.sqlite'
      : path.join(process.cwd(), 'database.sqlite');
    sqliteClient = new Database(sqlitePath);
  }
  return sqliteClient;
}

function buildSqliteQuery(strings, values) {
  let text = '';

  for (let i = 0; i < strings.length; i += 1) {
    text += strings[i];
    if (i < values.length) text += '?';
  }

  return { text, values };
}

function isReadOnlyQuery(query) {
  return /^\s*(SELECT|PRAGMA|WITH)\b/i.test(query);
}

export async function sql(strings, ...values) {
  const neonClient = await getNeonClient();
  if (neonClient) {
    return neonClient(strings, ...values);
  }

  const db = getSqliteClient();
  const { text, values: params } = buildSqliteQuery(strings, values);
  const statement = db.prepare(text);

  if (isReadOnlyQuery(text)) {
    return statement.all(...params);
  }

  statement.run(...params);
  return [];
}

export async function initDB() {
  if (initCompleted) return;
  if (initInProgress) {
    await initInProgress;
    return;
  }

  initInProgress = (async () => {
    const usingNeon = Boolean(await getNeonClient());

    if (usingNeon) {
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

      await sql`
        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          user_id INTEGER,
          user_email TEXT NOT NULL,
          shipping_name TEXT NOT NULL,
          shipping_price REAL NOT NULL,
          payment_method TEXT NOT NULL,
          total REAL NOT NULL,
          status TEXT DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS order_items (
          id SERIAL PRIMARY KEY,
          order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
          product_id INTEGER,
          product_name TEXT NOT NULL,
          product_price REAL NOT NULL,
          size TEXT NOT NULL,
          quantity INTEGER NOT NULL
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS service_orders (
          id SERIAL PRIMARY KEY,
          user_id INTEGER,
          user_email TEXT NOT NULL,
          total REAL NOT NULL,
          status TEXT DEFAULT 'requested',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS service_order_items (
          id SERIAL PRIMARY KEY,
          service_order_id INTEGER REFERENCES service_orders(id) ON DELETE CASCADE,
          service_id INTEGER,
          service_name TEXT NOT NULL,
          service_price REAL NOT NULL
        )
      `;
    } else {
      await sql`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          price REAL NOT NULL,
          image TEXT NOT NULL,
          description TEXT,
          sizes TEXT NOT NULL
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS services (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          password TEXT NOT NULL,
          is_verified INTEGER DEFAULT 0,
          verification_token TEXT
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          user_email TEXT NOT NULL,
          shipping_name TEXT NOT NULL,
          shipping_price REAL NOT NULL,
          payment_method TEXT NOT NULL,
          total REAL NOT NULL,
          status TEXT DEFAULT 'pending',
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id INTEGER,
          product_id INTEGER,
          product_name TEXT NOT NULL,
          product_price REAL NOT NULL,
          size TEXT NOT NULL,
          quantity INTEGER NOT NULL,
          FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS service_orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          user_email TEXT NOT NULL,
          total REAL NOT NULL,
          status TEXT DEFAULT 'requested',
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS service_order_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          service_order_id INTEGER,
          service_id INTEGER,
          service_name TEXT NOT NULL,
          service_price REAL NOT NULL,
          FOREIGN KEY(service_order_id) REFERENCES service_orders(id) ON DELETE CASCADE
        )
      `;
    }

    const counts = await sql`SELECT COUNT(*) as count FROM products`;
    const totalProducts = Number(counts?.[0]?.count ?? 0);

    if (totalProducts === 0) {
      for (const prod of PRODUCT_SEED) {
        await sql`INSERT INTO products (name, price, image, description, sizes) VALUES (${prod.name}, ${prod.price}, ${prod.image}, ${prod.description}, ${prod.sizes})`;
      }

      for (const service of SERVICE_SEED) {
        await sql`INSERT INTO services (name, description, price) VALUES (${service.name}, ${service.description}, ${service.price})`;
      }
    }
  })();

  try {
    await initInProgress;
    initCompleted = true;
  } finally {
    initInProgress = null;
  }
}

export default sql;
