import { userStore } from "./data/user-store";
import { UserRepository } from "./repository/user-repository";
import { AuthService } from "./services/auth-service";
import { UserService } from "./services/user-service";
import { AuthController } from "./controllers/auth-controller";
import { UserController } from "./controllers/user-controller";
import { AuthMiddleware } from "./middlewares/auth-middleware";

/**
 * Dependency Injection Container (Composition Root)
 *
 * This module wires up all dependencies manually following the
 * Dependency Injection pattern. Benefits:
 * - Loose coupling: classes depend on abstractions, not concretions
 * - Testability: easy to mock dependencies in unit tests
 * - Single source of truth for object graph construction
 *
 * In larger projects, consider using a DI library like tsyringe or inversify.
 */

// Data layer
const userRepository = new UserRepository(userStore);

// Business logic layer (services depend on repositories)
const authService = new AuthService(userRepository);
const userService = new UserService(userRepository);

// Presentation layer (controllers depend on services)
const authController = new AuthController(authService);
const userController = new UserController(userService);

// Middleware (depends on auth service for token verification)
const authMiddleware = new AuthMiddleware(authService);

export { authController, userController, authMiddleware };
