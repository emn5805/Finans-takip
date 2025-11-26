import { validationResult } from 'express-validator';
import AppError from './appError.js';

export const handleValidation = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((error) => ({
      field: error.param,
      message: error.msg,
    }));
    return next(new AppError(422, 'Validation failed', formatted));
  }
  return next();
};
