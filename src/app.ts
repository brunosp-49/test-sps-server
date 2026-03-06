import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import routes from "./routes/routes";
import { ErrorCodes } from "./constants/error-codes";

/**
 * Express app configuration.
 * Separated from index.ts to allow importing the app instance for testing
 * with supertest without starting the server.
 */
const app = express();

/**
 * Global rate limiter to prevent DoS attacks.
 * - 100 requests per IP every 15 minutes
 * - Disabled in test environment to avoid flaky tests
 * - Returns standardized error format for consistency
 */
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === "test",
  handler: (_req, res) => {
    res.status(429).json({ error: ErrorCodes.tooManyRequests });
  },
});

app.use(cors());
app.use(globalRateLimiter);
// Body size limit prevents large payload attacks (DoS prevention)
app.use(express.json({ limit: "100kb" }));
app.use(routes);

export default app;
