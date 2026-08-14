import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { signupSchema, loginSchema, changePasswordSchema } from '../validators/auth.validator.js';

const router = Router();

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authenticate, authController.logout);
router.put('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword);
router.get('/profile', authenticate, authController.getProfile);

export default router;
