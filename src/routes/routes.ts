import { Router } from "express";
import authRoutes from "./auth-routes";
import userRoutes, { authMiddleware } from "./user-routes";

const routes = Router();

// Public routes (no Authorization header required) - registered first
routes.get("/", (req, res) => {
  res.send("Hello World!");
});

routes.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Login: POST /auth is public; do not require Bearer token
routes.use("/", authRoutes);

// Protected routes under /users only - middleware never runs for /auth
routes.use("/users", authMiddleware.execute.bind(authMiddleware), userRoutes);

export default routes;
