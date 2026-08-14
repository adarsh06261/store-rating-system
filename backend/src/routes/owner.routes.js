import { Router } from 'express';
import * as ownerController from '../controllers/owner.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate, authorize('STORE_OWNER'));

router.get('/dashboard', ownerController.getDashboard);

export default router;
