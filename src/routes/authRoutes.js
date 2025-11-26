import { Router } from 'express';
import { body } from 'express-validator';

import { register, login } from '../controllers/authController.js';
import { handleValidation } from '../utils/validation.js';

const router = Router();

const emailValidator = body('email').isEmail().withMessage('Please provide a valid email address.');
const passwordValidator = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long.');

router.post('/register', [emailValidator, passwordValidator, handleValidation], register);
router.post('/login', [emailValidator, passwordValidator, handleValidation], login);

export default router;
