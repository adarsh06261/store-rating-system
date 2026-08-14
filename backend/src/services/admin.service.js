import prisma from '../config/db.js';
import { hashPassword, sanitizeUser } from '../utils/password.js';

export const getDashboardStats = async () => {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
  ]);

  return { totalUsers, totalStores, totalRatings };
};

export const getUsers = async ({ search, role, sortBy, sortOrder, page, limit }) => {
  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { address: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (role) where.role = role;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
        _count: { select: { ratings: true, ownedStores: true } },
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      ratings: {
        include: { store: { select: { id: true, name: true, email: true } } },
      },
      ownedStores: {
        include: {
          _count: { select: { ratings: true } },
          ratings: { select: { rating: true } },
        },
      },
    },
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

export const createUser = async ({ name, email, password, address, role }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, address, role },
  });

  return sanitizeUser(user);
};

export const getStores = async ({ search, sortBy, sortOrder, minRating, maxRating, page, limit }) => {
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
      owner: { select: { id: true, name: true, email: true } },
      ratings: { select: { rating: true } },
      _count: { select: { ratings: true } },
    },
  });

  let enriched = stores.map((store) => {
    const avg =
      store.ratings.length > 0
        ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
        : 0;
    const { ratings, ...rest } = store;
    return { ...rest, averageRating: Math.round(avg * 10) / 10 };
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

export const getStoreById = async (id) => {
  const store = await prisma.store.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, email: true, address: true } },
      ratings: {
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      },
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

  return { ...store, averageRating };
};

export const createStore = async ({ name, email, address, ownerId }) => {
  const owner = await prisma.user.findUnique({ where: { id: ownerId } });
  if (!owner || owner.role !== 'STORE_OWNER') {
    const error = new Error('Invalid store owner');
    error.statusCode = 400;
    throw error;
  }

  const existing = await prisma.store.findUnique({ where: { email } });
  if (existing) {
    const error = new Error('Store email already exists');
    error.statusCode = 409;
    throw error;
  }

  return prisma.store.create({
    data: { name, email, address, ownerId },
    include: { owner: { select: { id: true, name: true, email: true } } },
  });
};

export const getStoreOwners = async () => {
  return prisma.user.findMany({
    where: { role: 'STORE_OWNER' },
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' },
  });
};
