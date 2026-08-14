import prisma from '../config/db.js';

export const submitRating = async (userId, storeId, rating) => {
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) {
    const error = new Error('Store not found');
    error.statusCode = 404;
    throw error;
  }

  const existing = await prisma.rating.findUnique({
    where: { userId_storeId: { userId, storeId } },
  });

  if (existing) {
    const error = new Error('You have already rated this store. Use update instead.');
    error.statusCode = 409;
    throw error;
  }

  return prisma.rating.create({
    data: { userId, storeId, rating },
    include: { store: { select: { id: true, name: true } } },
  });
};

export const updateRating = async (userId, storeId, rating) => {
  const existing = await prisma.rating.findUnique({
    where: { userId_storeId: { userId, storeId } },
  });

  if (!existing) {
    const error = new Error('Rating not found. Submit a rating first.');
    error.statusCode = 404;
    throw error;
  }

  return prisma.rating.update({
    where: { userId_storeId: { userId, storeId } },
    data: { rating },
    include: { store: { select: { id: true, name: true } } },
  });
};

export const getUserRatings = async (userId) => {
  return prisma.rating.findMany({
    where: { userId },
    include: { store: { select: { id: true, name: true, email: true } } },
    orderBy: { updatedAt: 'desc' },
  });
};
