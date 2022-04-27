import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  {
    name: 'Development',
    sub_categories: {
      create: [
        {
          name: 'Frontend',
        },
        {
          name: 'Backend',
        },
      ],
    },
  },
  {
    name: 'Design',
    sub_categories: {
      create: [
        {
          name: 'UI',
        },
        {
          name: 'UX',
        },
      ],
    },
  },
  {
    name: 'Business',
    sub_categories: {
      create: [
        {
          name: 'Marketing',
        },
        {
          name: 'Sales',
        },
      ],
    },
  },
  {
    name: 'Product',
    sub_categories: {
      create: [
        {
          name: 'Design',
        },
        {
          name: 'Development',
        },
      ],
    },
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of categories) {
    const category = await prisma.category.create({
      data: u,
    });
    console.log(`Created category with id: ${category.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
