import { Router } from 'express';
import {
  registerUserController,
  loginUserController,
  refreshUserSessionController,
  logoutUserController,
  sendResetEmailController,
} from '../controllers/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerUserSchema,
  loginUserSchema,
  sendPasswordResetSchema,
} from '../validation/auth.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post('/refresh', ctrlWrapper(refreshUserSessionController));

router.post('/logout', ctrlWrapper(logoutUserController));

// router.post(
//   '/request-reset-email',
//   validateBody(requestPasswordResetSchema),
//   ctrlWrapper(requestResetEmailController),
// );

router.post(
  '/send-reset-email',
  validateBody(sendPasswordResetSchema),
  ctrlWrapper(sendResetEmailController),
);
export default router;
