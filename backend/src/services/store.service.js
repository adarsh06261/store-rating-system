import prisma from '../config/db.js';

export const getStoresForUser = async (userId, query) => {
  const { search, sortBy, sortOrder, minRating, maxRating, page, limit } = query;
  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { address: { contains: search, mode: 'insensitive' } },
    ];
  }

  const stores = await prisma.store.findMany({
    where,
    include: {
      owner: { select: { id: true, name: true } },
      ratings: { select: { rating: true, userId: true } },
      _count: { select: { ratings: true } },
    },
  });

  let enriched = stores.map((store) => {
    const avg =
      store.ratings.length > 0
        ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
        : 0;
    const userRating = store.ratings.find((r) => r.userId === userId);
    const { ratings, ...rest } = store;
    return {
      ...rest,
      averageRating: Math.round(avg * 10) / 10,
      userRating: userRating?.rating ?? null,
    };
  });

  if (minRating !== undefined) {
    enriched = enriched.filter((s) => s.averageRating >= minRating);
  }
  if (maxRating !== undefined) {
    enriched = enriched.filter((s) => s.averageRating <= maxRating);
  }

  if (sortBy === 'averageRating') {
    enriched.sort((a, b) =>
      sortOrder === 'asc' ? a.averageRating - b.averageRating : b.averageRating - a.averageRating
    );
  } else {
    enriched.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const total = enriched.length;
  const paginated = enriched.slice((page - 1) * limit, page * limit);

  return { stores: paginated, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getStoreById = async (id, userId) => {
  const store = await prisma.store.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true } },
      ratings: { select: { rating: true, userId: true } },
      _count: { select: { ratings: true } },
    },
  });

  if (!store) {
    const error = new Error('Store not found');
    error.statusCode = 404;
    throw error;
  }

  const averageRating =
    store.ratings.length > 0
      ? Math.round((store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length) * 10) / 10
      : 0;

  const userRating = store.ratings.find((r) => r.userId === userId);

  return {
    ...store,
    averageRating,
    userRating: userRating?.rating ?? null,
    ratings: undefined,
  };
};
