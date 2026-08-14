import { Router } from 'express';
import * as storeController from '../controllers/store.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validateQuery } from '../middleware/validate.js';
import { storeListQuerySchema } from '../validators/admin.validator.js';

const router = Router();

router.use(authenticate, authorize('USER'));

router.get('/', validateQuery(storeListQuerySchema), storeController.getStores);
router.get('/:id', storeController.getStoreById);

export default router;
