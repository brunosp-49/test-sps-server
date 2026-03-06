import type { Request, Response } from "express";
import type { AuthService } from "../services/auth-service";
import { loginSchema } from "../schemas/auth-schemas";
import { ErrorCodes } from "../constants/error-codes";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  handleLogin(req: Request, res: Response): void {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: ErrorCodes.validationFailed,
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }
    try {
      const result = this.authService.login(parsed.data);
      res.status(200).json(result);
    } catch {
      res.status(401).json({ error: ErrorCodes.invalidCredentials });
    }
  }
}
