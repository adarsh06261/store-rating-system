import * as authService from '../services/auth.service.js';

export const signup = async (req, res, next) => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

export const changePassword = async (req, res, next) => {
  try {
    const result = await authService.changePassword(req.user.id, req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
