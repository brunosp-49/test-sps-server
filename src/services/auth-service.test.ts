import bcrypt from "bcrypt";
import { AuthService } from "./auth-service";
import type { UserRepository } from "../repository/user-repository";
import type { User } from "../types/user";

describe("AuthService", () => {
  let mockUserRepository: jest.Mocked<UserRepository>;
  let authService: AuthService;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    authService = new AuthService(mockUserRepository);
  });

  describe("login", () => {
    it("should return token and user when credentials are valid", () => {
      const passwordHash = bcrypt.hashSync("password123", 10);
      const user: User = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        type: "user",
        passwordHash,
      };
      mockUserRepository.findByEmail.mockReturnValue(user);

      const result = authService.login({
        email: "test@example.com",
        password: "password123",
      });

      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe("string");
      expect(result.user).toEqual({
        id: "1",
        name: "Test User",
        email: "test@example.com",
        type: "user",
      });
    });

    it("should throw error when email does not exist", () => {
      mockUserRepository.findByEmail.mockReturnValue(undefined);

      expect(() =>
        authService.login({
          email: "nonexistent@example.com",
          password: "password123",
        })
      ).toThrow("Invalid credentials");
    });

    it("should throw error when password is incorrect", () => {
      const passwordHash = bcrypt.hashSync("correctPassword", 10);
      const user: User = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        type: "user",
        passwordHash,
      };
      mockUserRepository.findByEmail.mockReturnValue(user);

      expect(() =>
        authService.login({
          email: "test@example.com",
          password: "wrongPassword",
        })
      ).toThrow("Invalid credentials");
    });
  });

  describe("verifyToken", () => {
    it("should return payload when token is valid", () => {
      const passwordHash = bcrypt.hashSync("password123", 10);
      const user: User = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        type: "user",
        passwordHash,
      };
      mockUserRepository.findByEmail.mockReturnValue(user);

      const { token } = authService.login({
        email: "test@example.com",
        password: "password123",
      });

      const payload = authService.verifyToken(token);

      expect(payload.userId).toBe("1");
      expect(payload.email).toBe("test@example.com");
    });

    it("should throw error when token is invalid", () => {
      expect(() => authService.verifyToken("invalid-token")).toThrow();
    });
  });
});
