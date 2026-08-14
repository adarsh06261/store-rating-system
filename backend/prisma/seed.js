import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const hashPassword = (password) => bcrypt.hash(password, 12);

async function main() {
  console.log('Seeding database...');

  const adminPassword = await hashPassword('Admin@123');
  const userPassword = await hashPassword('User@12345');
  const ownerPassword = await hashPassword('Owner@1234');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@store.com' },
    update: {},
    create: {
      name: 'System Administrator Account',
      email: 'admin@store.com',
      password: adminPassword,
      address: '123 Admin Street, City Center',
      role: 'ADMIN',
    },
  });

  const owner1 = await prisma.user.upsert({
    where: { email: 'owner1@store.com' },
    update: {},
    create: {
      name: 'Store Owner One Business',
      email: 'owner1@store.com',
      password: ownerPassword,
      address: '456 Owner Avenue, Downtown',
      role: 'STORE_OWNER',
    },
  });

  const owner2 = await prisma.user.upsert({
    where: { email: 'owner2@store.com' },
    update: {},
    create: {
      name: 'Store Owner Two Business',
      email: 'owner2@store.com',
      password: ownerPassword,
      address: '789 Owner Boulevard, Uptown',
      role: 'STORE_OWNER',
    },
  });

  const user1 = await prisma.user.upsert({
    where: { email: 'user1@example.com' },
    update: {},
    create: {
      name: 'Normal User One Account',
      email: 'user1@example.com',
      password: userPassword,
      address: '101 User Lane, Suburb',
      role: 'USER',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user2@example.com' },
    update: {},
    create: {
      name: 'Normal User Two Account',
      email: 'user2@example.com',
      password: userPassword,
      address: '202 User Road, Suburb',
      role: 'USER',
    },
  });

  const store1 = await prisma.store.upsert({
    where: { email: 'freshmart@store.com' },
    update: {},
    create: {
      name: 'FreshMart Grocery Store',
      email: 'freshmart@store.com',
      address: '100 Market Street, Downtown',
      ownerId: owner1.id,
    },
  });

  const store2 = await prisma.store.upsert({
    where: { email: 'techhub@store.com' },
    update: {},
    create: {
      name: 'TechHub Electronics Store',
      email: 'techhub@store.com',
      address: '200 Innovation Drive, Tech Park',
      ownerId: owner1.id,
    },
  });

  const store3 = await prisma.store.upsert({
    where: { email: 'greenleaf@store.com' },
    update: {},
    create: {
      name: 'GreenLeaf Organic Market',
      email: 'greenleaf@store.com',
      address: '300 Nature Way, Green District',
      ownerId: owner2.id,
    },
  });

  await prisma.rating.upsert({
    where: { userId_storeId: { userId: user1.id, storeId: store1.id } },
    update: { rating: 5 },
    create: { userId: user1.id, storeId: store1.id, rating: 5 },
  });

  await prisma.rating.upsert({
    where: { userId_storeId: { userId: user1.id, storeId: store2.id } },
    update: { rating: 4 },
    create: { userId: user1.id, storeId: store2.id, rating: 4 },
  });

  await prisma.rating.upsert({
    where: { userId_storeId: { userId: user2.id, storeId: store1.id } },
    update: { rating: 3 },
    create: { userId: user2.id, storeId: store1.id, rating: 3 },
  });

  await prisma.rating.upsert({
    where: { userId_storeId: { userId: user2.id, storeId: store3.id } },
    update: { rating: 5 },
    create: { userId: user2.id, storeId: store3.id, rating: 5 },
  });

  console.log('Seed completed successfully!');
  console.log('\nDemo accounts:');
  console.log('  Admin:  admin@store.com / Admin@123');
  console.log('  Owner:  owner1@store.com / Owner@1234');
  console.log('  User:   user1@example.com / User@12345');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
