import { UserService } from "./user-service";
import type { UserRepository } from "../repository/user-repository";
import type { User } from "../types/user";

describe("UserService", () => {
  let mockUserRepository: jest.Mocked<UserRepository>;
  let userService: UserService;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    userService = new UserService(mockUserRepository);
  });

  describe("registerUser", () => {
    it("should create user and return user response without password", () => {
      mockUserRepository.findByEmail.mockReturnValue(undefined);
      mockUserRepository.create.mockReturnValue({
        id: "1",
        name: "New User",
        email: "new@example.com",
        type: "user",
        passwordHash: "hashedPassword",
      });

      const result = userService.registerUser({
        name: "New User",
        email: "new@example.com",
        type: "user",
        password: "password123",
      });

      expect(result).toEqual({
        id: "1",
        name: "New User",
        email: "new@example.com",
        type: "user",
      });
      expect(result).not.toHaveProperty("passwordHash");
      expect(mockUserRepository.create).toHaveBeenCalled();
    });

    it("should throw error when email is already registered", () => {
      const existingUser: User = {
        id: "1",
        name: "Existing User",
        email: "existing@example.com",
        type: "user",
        passwordHash: "hash",
      };
      mockUserRepository.findByEmail.mockReturnValue(existingUser);

      expect(() =>
        userService.registerUser({
          name: "New User",
          email: "existing@example.com",
          type: "user",
          password: "password123",
        })
      ).toThrow("Email already registered");
    });
  });

  describe("updateUser", () => {
    it("should update user and return updated response", () => {
      const existingUser: User = {
        id: "1",
        name: "Original Name",
        email: "original@example.com",
        type: "user",
        passwordHash: "hash",
      };
      mockUserRepository.findById.mockReturnValue(existingUser);
      mockUserRepository.findByEmail.mockReturnValue(undefined);
      mockUserRepository.update.mockReturnValue({
        id: "1",
        name: "Updated Name",
        email: "updated@example.com",
        type: "user",
        passwordHash: "hash",
      });

      const result = userService.updateUser("1", {
        name: "Updated Name",
        email: "updated@example.com",
      });

      expect(result).toEqual({
        id: "1",
        name: "Updated Name",
        email: "updated@example.com",
        type: "user",
      });
    });

    it("should throw error when user is not found", () => {
      mockUserRepository.findById.mockReturnValue(undefined);

      expect(() =>
        userService.updateUser("999", { name: "Test" })
      ).toThrow("User not found");
    });

    it("should throw error when email is already in use by another user", () => {
      const existingUser: User = {
        id: "1",
        name: "User 1",
        email: "user1@example.com",
        type: "user",
        passwordHash: "hash1",
      };
      const otherUser: User = {
        id: "2",
        name: "User 2",
        email: "user2@example.com",
        type: "user",
        passwordHash: "hash2",
      };
      mockUserRepository.findById.mockReturnValue(existingUser);
      mockUserRepository.findByEmail.mockReturnValue(otherUser);

      expect(() =>
        userService.updateUser("1", { email: "user2@example.com" })
      ).toThrow("Email already in use");
    });

    it("should allow user to keep their own email", () => {
      const existingUser: User = {
        id: "1",
        name: "User 1",
        email: "user1@example.com",
        type: "user",
        passwordHash: "hash1",
      };
      mockUserRepository.findById.mockReturnValue(existingUser);
      mockUserRepository.findByEmail.mockReturnValue(existingUser);
      mockUserRepository.update.mockReturnValue(existingUser);

      const result = userService.updateUser("1", { email: "user1@example.com" });

      expect(result).toBeDefined();
    });
  });

  describe("deleteUser", () => {
    it("should remove user successfully", () => {
      mockUserRepository.remove.mockReturnValue(true);

      expect(() => userService.deleteUser("1")).not.toThrow();
      expect(mockUserRepository.remove).toHaveBeenCalledWith("1");
    });

    it("should throw error when user is not found", () => {
      mockUserRepository.remove.mockReturnValue(false);

      expect(() => userService.deleteUser("999")).toThrow("User not found");
    });
  });

  describe("getUserById", () => {
    it("should return user response when user exists", () => {
      const user: User = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        type: "user",
        passwordHash: "hash",
      };
      mockUserRepository.findById.mockReturnValue(user);

      const result = userService.getUserById("1");

      expect(result).toEqual({
        id: "1",
        name: "Test User",
        email: "test@example.com",
        type: "user",
      });
      expect(result).not.toHaveProperty("passwordHash");
    });

    it("should return undefined when user does not exist", () => {
      mockUserRepository.findById.mockReturnValue(undefined);

      const result = userService.getUserById("999");

      expect(result).toBeUndefined();
    });
  });

  describe("listUsers", () => {
    it("should return all users without password hashes", () => {
      const users: User[] = [
        {
          id: "1",
          name: "User 1",
          email: "user1@example.com",
          type: "user",
          passwordHash: "hash1",
        },
        {
          id: "2",
          name: "User 2",
          email: "user2@example.com",
          type: "admin",
          passwordHash: "hash2",
        },
      ];
      mockUserRepository.findAll.mockReturnValue(users);

      const result = userService.listUsers();

      expect(result).toEqual([
        { id: "1", name: "User 1", email: "user1@example.com", type: "user" },
        { id: "2", name: "User 2", email: "user2@example.com", type: "admin" },
      ]);
      result.forEach((user) => {
        expect(user).not.toHaveProperty("passwordHash");
      });
    });

    it("should return empty array when no users exist", () => {
      mockUserRepository.findAll.mockReturnValue([]);

      const result = userService.listUsers();

      expect(result).toEqual([]);
    });
  });
});
