import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log("Deleting old products...");
  await sql`DELETE FROM products;`;
  
  const productsToSeed = [
    { name: 'Huarache Clásico Tejido', price: 85.00, image: 'https://images.unsplash.com/photo-1616866168339-399066cbab8e?ixlib=rb-4.0.3&w=800&q=80', desc: 'Huaraches tradicionales mexicanos tejidos a mano por artesanos veracruzanos. Piel 100% natural.', sizes: '23,24,25,26,27,28' },
    { name: 'Sandalia de Piel Fina', price: 95.00, image: 'https://images.unsplash.com/photo-1595991209266-5e04278dc71f?ixlib=rb-4.0.3&w=800&q=80', desc: 'Sandalia artesanal con acabados finos y detalles autóctonos que resaltan nuestra cultura.', sizes: '22,23,24,25,26,27' },
    { name: 'Bota Artesanal de Trabajo', price: 120.00, image: 'https://images.unsplash.com/photo-1580982545800-47b2bd3c5c96?ixlib=rb-4.0.3&w=800&q=80', desc: 'Botas de piel genuina, cosidas a mano y diseñadas para durar toda la vida con el mantenimiento adecuado.', sizes: '25,26,27,28,29,30' },
    { name: 'Huarache Cruzado', price: 89.00, image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?ixlib=rb-4.0.3&w=800&q=80', desc: 'Un diseño cómodo y fresco con correas de cuero entrelazadas al estilo tradicional.', sizes: '24,25,26,27,28' }
  ];

  for (const prod of productsToSeed) {
    await sql`INSERT INTO products (name, price, image, description, sizes) VALUES (${prod.name}, ${prod.price}, ${prod.image}, ${prod.desc}, ${prod.sizes})`;
  }
  
  console.log("Database seeded successfully with artisan products!");
}

main().catch(console.error);
