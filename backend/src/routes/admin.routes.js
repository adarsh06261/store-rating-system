import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate, validateQuery } from '../middleware/validate.js';
import {
  createUserSchema,
  createStoreSchema,
  listQuerySchema,
  storeListQuerySchema,
} from '../validators/admin.validator.js';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/users', validateQuery(listQuerySchema), adminController.getUsers);
router.post('/users', validate(createUserSchema), adminController.createUser);
router.get('/users/:id', adminController.getUserById);
router.get('/stores', validateQuery(storeListQuerySchema), adminController.getStores);
router.post('/stores', validate(createStoreSchema), adminController.createStore);
router.get('/stores/:id', adminController.getStoreById);
router.get('/store-owners', adminController.getStoreOwners);

export default router;
