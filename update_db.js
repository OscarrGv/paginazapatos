const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany({});
  
  const products = [
    {
      name: 'Huarache Clásico Tejido',
      price: 85.00,
      image: 'https://images.unsplash.com/photo-1616866168339-399066cbab8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Huaraches tradicionales mexicanos tejidos a mano por artesanos veracruzanos. Piel 100% natural.',
      sizes: '23,24,25,26,27,28'
    },
    {
      name: 'Sandalia de Piel Fina',
      price: 95.00,
      image: 'https://images.unsplash.com/photo-1595991209266-5e04278dc71f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Sandalia artesanal con acabados finos y detalles autóctonos que resaltan nuestra cultura.',
      sizes: '22,23,24,25,26,27'
    },
    {
      name: 'Bota Artesanal de Trabajo',
      price: 120.00,
      image: 'https://images.unsplash.com/photo-1580982545800-47b2bd3c5c96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Botas de piel genuina, cosidas a mano y diseñadas para durar toda la vida con el mantenimiento adecuado.',
      sizes: '25,26,27,28,29,30'
    },
    {
      name: 'Huarache Cruzado',
      price: 89.00,
      image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Un diseño cómodo y fresco con correas de cuero entrelazadas al estilo tradicional.',
      sizes: '24,25,26,27,28'
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }
  console.log("DB Updated");
}

main().catch(console.error).finally(() => prisma.$disconnect());
