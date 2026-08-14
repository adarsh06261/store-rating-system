import prisma from '../config/db.js';
import { hashPassword, comparePassword, sanitizeUser } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';

export const signup = async ({ name, email, password, address }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, address, role: 'USER' },
  });

  const token = generateToken(user.id, user.role);
  return { user: sanitizeUser(user), token };
};

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user.id, user.role);
  return { user: sanitizeUser(user), token };
};

export const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const isValid = await comparePassword(currentPassword, user.password);
  if (!isValid) {
    const error = new Error('Current password is incorrect');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: 'Password changed successfully' };
};

export const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return sanitizeUser(user);
};
