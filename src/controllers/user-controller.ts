import type { Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth-middleware";
import type { UserService } from "../services/user-service";
import { createUserSchema, updateUserSchema, userIdParamSchema } from "../schemas/user-schemas";
import { ErrorCodes } from "../constants/error-codes";

export class UserController {
  constructor(private readonly userService: UserService) {}

  list(req: AuthenticatedRequest, res: Response): void {
    const users = this.userService.listUsers();
    res.status(200).json(users);
  }

  register(req: AuthenticatedRequest, res: Response): void {
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: ErrorCodes.validationFailed,
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }
    try {
      const user = this.userService.registerUser(parsed.data);
      res.status(201).json(user);
    } catch (err) {
      this.handleUserError(res, err);
    }
  }

  edit(req: AuthenticatedRequest, res: Response): void {
    const paramParsed = userIdParamSchema.safeParse({ id: req.params.id });
    if (!paramParsed.success) {
      res.status(400).json({
        error: ErrorCodes.validationFailed,
        details: paramParsed.error.flatten().fieldErrors,
      });
      return;
    }
    const bodyParsed = updateUserSchema.safeParse(req.body);
    if (!bodyParsed.success) {
      res.status(400).json({
        error: ErrorCodes.validationFailed,
        details: bodyParsed.error.flatten().fieldErrors,
      });
      return;
    }
    try {
      const updated = this.userService.updateUser(paramParsed.data.id, bodyParsed.data);
      res.status(200).json(updated);
    } catch (err) {
      this.handleUserError(res, err, 404);
    }
  }

  remove(req: AuthenticatedRequest, res: Response): void {
    const parsed = userIdParamSchema.safeParse({ id: req.params.id });
    if (!parsed.success) {
      res.status(400).json({
        error: ErrorCodes.validationFailed,
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }
    try {
      this.userService.deleteUser(parsed.data.id);
      res.status(204).send();
    } catch (err) {
      this.handleUserError(res, err, 404);
    }
  }

  getById(req: AuthenticatedRequest, res: Response): void {
    const parsed = userIdParamSchema.safeParse({ id: req.params.id });
    if (!parsed.success) {
      res.status(400).json({
        error: ErrorCodes.validationFailed,
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }
    const user = this.userService.getUserById(parsed.data.id);
    if (!user) {
      res.status(404).json({ error: ErrorCodes.userNotFound });
      return;
    }
    res.status(200).json(user);
  }

  private handleUserError(res: Response, err: unknown, notFoundStatus = 400): void {
    const message = err instanceof Error ? err.message : "";
    if (message === "User not found") {
      res.status(notFoundStatus).json({ error: ErrorCodes.userNotFound });
    } else if (message === "Email already registered") {
      res.status(400).json({ error: ErrorCodes.emailAlreadyRegistered });
    } else if (message === "Email already in use") {
      res.status(400).json({ error: ErrorCodes.emailAlreadyInUse });
    } else {
      res.status(500).json({ error: ErrorCodes.internalError });
    }
  }
}
