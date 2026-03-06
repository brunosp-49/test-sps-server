import { Router } from "express";
import authRoutes from "./auth-routes";
import userRoutes, { authMiddleware } from "./user-routes";

const routes = Router();

routes.get("/", (req, res) => {
  res.send("Hello World!");
});

routes.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

routes.use(authRoutes);

routes.use(authMiddleware.execute.bind(authMiddleware), userRoutes);

export default routes;
