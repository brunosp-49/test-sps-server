import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authController } from "../container";
import { ErrorCodes } from "../constants/error-codes";

const authRoutes = Router();

/**
 * Strict rate limiter for login endpoint to prevent brute force attacks.
 * - 5 attempts per IP every 15 minutes (stricter than global limiter)
 * - Disabled in test environment to avoid test failures
 * - Uses standardHeaders (RateLimit-*) for client-side handling
 */
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "test",
  handler: (_req, res) => {
    res.status(429).json({ error: ErrorCodes.tooManyRequests });
  },
});

// .bind() is required because the method uses 'this' to access authService
authRoutes.post("/auth", loginRateLimiter, authController.handleLogin.bind(authController));

export default authRoutes;
