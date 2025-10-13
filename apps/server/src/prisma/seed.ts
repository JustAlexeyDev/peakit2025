import { prisma } from '../lib/prisma.js';

async function main() {
  const place1 = await prisma.place.upsert({
    where: { slug: 'lenskiye-stolby-view' },
    update: {},
    create: {
      slug: 'lenskiye-stolby-view',
      name: 'Ленские столбы — смотровая точка',
      description: 'Панорамные виды на скалы и реку Лена.',
      latitude: 61.1167,
      longitude: 128.4,
      category: 'viewpoint'
    }
  });

  const route = await prisma.route.upsert({
    where: { id: 'seed-route' },
    update: {},
    create: {
      id: 'seed-route',
      title: 'Классический маршрут',
      description: 'Обзорный маршрут по основным точкам Ленских столбов.',
      durationMin: 120,
      distanceKm: 5.2,
      places: { connect: [{ id: place1.id }] },
      points: {
        create: [
          { order: 1, latitude: 61.1163, longitude: 128.3995 },
          { order: 2, latitude: place1.latitude, longitude: place1.longitude }
        ]
      }
    }
  });

  console.log('Seeded:', { place1: place1.slug, route: route.title });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});

