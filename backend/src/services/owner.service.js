import prisma from '../config/db.js';

export const getOwnerDashboard = async (ownerId) => {
  const stores = await prisma.store.findMany({
    where: { ownerId },
    include: {
      ratings: {
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      },
      _count: { select: { ratings: true } },
    },
  });

  const storeStats = stores.map((store) => {
    const averageRating =
      store.ratings.length > 0
        ? Math.round((store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length) * 10) / 10
        : 0;

    return {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      totalRatings: store._count.ratings,
      averageRating,
      ratings: store.ratings.map((r) => ({
        id: r.id,
        rating: r.rating,
        createdAt: r.createdAt,
        user: r.user,
      })),
    };
  });

  const overallAverage =
    storeStats.length > 0
      ? Math.round(
          (storeStats.reduce((sum, s) => sum + s.averageRating, 0) / storeStats.length) * 10
        ) / 10
      : 0;

  const totalRatings = storeStats.reduce((sum, s) => sum + s.totalRatings, 0);

  return {
    totalStores: stores.length,
    totalRatings,
    overallAverage,
    stores: storeStats,
  };
};
