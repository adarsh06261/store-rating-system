import { Router } from 'express';
import * as ratingController from '../controllers/rating.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { submitRatingSchema } from '../validators/admin.validator.js';

const router = Router();

router.use(authenticate, authorize('USER'));

router.get('/my-ratings', ratingController.getUserRatings);
router.post('/stores/:storeId', validate(submitRatingSchema), ratingController.submitRating);
router.put('/stores/:storeId', validate(submitRatingSchema), ratingController.updateRating);

export default router;
