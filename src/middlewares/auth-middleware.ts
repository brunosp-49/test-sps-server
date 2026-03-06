import type { Request, Response, NextFunction } from "express";
import type { AuthService } from "../services/auth-service";
import { ErrorCodes } from "../constants/error-codes";

/**
 * Extended Request interface with authenticated user data.
 * Used by protected route handlers to access the current user's ID.
 */
export interface AuthenticatedRequest extends Request {
  userId?: string;
}

/**
 * JWT Authentication Middleware.
 * Validates Bearer token and attaches userId to the request object.
 * Returns standardized error codes for different failure scenarios.
 */
export class AuthMiddleware {
  constructor(private readonly authService: AuthService) {}

  /**
   * Middleware execution flow:
   * 1. Check for Authorization header with Bearer scheme
   * 2. Extract and verify JWT token
   * 3. Attach userId to request for downstream handlers
   * 4. Call next() on success, return 401 on failure
   */
  execute(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    // Validate header format: "Bearer <token>"
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: ErrorCodes.missingOrInvalidAuthorizationHeader });
      return;
    }

    // Extract token (skip "Bearer " prefix - 7 characters)
    const token = authHeader.slice(7);

    try {
      const payload = this.authService.verifyToken(token);
      // Attach user ID to request for use in route handlers
      req.userId = payload.userId;
      next();
    } catch {
      // Token invalid, expired, or tampered with
      res.status(401).json({ error: ErrorCodes.invalidOrExpiredToken });
    }
  }
}
