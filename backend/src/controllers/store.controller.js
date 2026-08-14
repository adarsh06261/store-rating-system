import * as storeService from '../services/store.service.js';

export const getStores = async (req, res, next) => {
  try {
    const result = await storeService.getStoresForUser(req.user.id, req.validatedQuery);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const getStoreById = async (req, res, next) => {
  try {
    const store = await storeService.getStoreById(req.params.id, req.user.id);
    res.json({ success: true, data: store });
  } catch (error) {
    next(error);
  }
};
