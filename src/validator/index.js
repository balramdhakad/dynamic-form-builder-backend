import { validationResult } from "express-validator";
import { ValidationError } from "../utils/errors.js";

export const validateHandler = (req, res, next) => {
  const result = validationResult(req);

  const { errors } = result;
  if (errors.length > 0) {
    return next(new ValidationError(errors[0].msg, errors));
  }

  next();
};
