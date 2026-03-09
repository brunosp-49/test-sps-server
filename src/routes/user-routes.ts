import { Router } from "express";
import { userController, authMiddleware } from "../container";

/**
 * User routes are mounted at /users, so paths here are relative to /users.
 * Example: get("/") => GET /users, get("/:id") => GET /users/:id
 */
const userRoutes = Router();

userRoutes.get("/", userController.list.bind(userController));
userRoutes.post("/", userController.register.bind(userController));
userRoutes.put("/:id", userController.edit.bind(userController));
userRoutes.delete("/:id", userController.remove.bind(userController));
userRoutes.get("/:id", userController.getById.bind(userController));

export default userRoutes;
export { authMiddleware };
