import { Router } from "express";
import {
  loginUserController,
  signupUserController,
} from "../controllers/authControllers.js";
import { loginValidator, signupValidator } from "../validator/authValidator.js";
import { loginEmailRateLimiter, signupEmailRateLimiter } from "../middlewares/rateLimit.js";


const router = Router();

router.post(
  "/login",
  loginEmailRateLimiter,
  loginValidator,
  loginUserController,
);
router.post(
  "/signup",
  signupValidator,
  signupEmailRateLimiter,
  signupUserController,
);

export default router;
