import * as adminService from '../services/admin.service.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const result = await adminService.getUsers(req.validatedQuery);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const user = await adminService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const getStores = async (req, res, next) => {
  try {
    const result = await adminService.getStores(req.validatedQuery);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getStoreById = async (req, res, next) => {
  try {
    const store = await adminService.getStoreById(req.params.id);
    res.json({ success: true, data: store });
  } catch (error) {
    next(error);
  }
};

export const createStore = async (req, res, next) => {
  try {
    const store = await adminService.createStore(req.body);
    res.status(201).json({ success: true, data: store });
  } catch (error) {
    next(error);
  }
};

export const getStoreOwners = async (req, res, next) => {
  try {
    const owners = await adminService.getStoreOwners();
    res.json({ success: true, data: owners });
  } catch (error) {
    next(error);
  }
};
