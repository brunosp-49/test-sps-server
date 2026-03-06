import { Router } from "express";
import { userController, authMiddleware } from "../container";

const userRoutes = Router();

userRoutes.get("/users", userController.list.bind(userController));
userRoutes.post("/users", userController.register.bind(userController));
userRoutes.put("/users/:id", userController.edit.bind(userController));
userRoutes.delete("/users/:id", userController.remove.bind(userController));
userRoutes.get("/users/:id", userController.getById.bind(userController));

export default userRoutes;
export { authMiddleware };
