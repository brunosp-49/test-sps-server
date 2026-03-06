import { UserRepository } from "./user-repository";
import type { User } from "../types/user";

describe("UserRepository", () => {
  let store: User[];
  let repository: UserRepository;

  beforeEach(() => {
    store = [];
    repository = new UserRepository(store);
  });

  describe("findByEmail", () => {
    it("should return user when email exists", () => {
      const user: User = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        type: "user",
        passwordHash: "hash123",
      };
      store.push(user);

      const found = repository.findByEmail("test@example.com");

      expect(found).toEqual(user);
    });

    it("should return user when email has different case", () => {
      const user: User = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        type: "user",
        passwordHash: "hash123",
      };
      store.push(user);

      const found = repository.findByEmail("TEST@EXAMPLE.COM");

      expect(found).toEqual(user);
    });

    it("should return undefined when email does not exist", () => {
      const found = repository.findByEmail("nonexistent@example.com");

      expect(found).toBeUndefined();
    });
  });

  describe("findById", () => {
    it("should return user when id exists", () => {
      const user: User = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        type: "user",
        passwordHash: "hash123",
      };
      store.push(user);

      const found = repository.findById("1");

      expect(found).toEqual(user);
    });

    it("should return undefined when id does not exist", () => {
      const found = repository.findById("999");

      expect(found).toBeUndefined();
    });
  });

  describe("findAll", () => {
    it("should return empty array when store is empty", () => {
      const all = repository.findAll();

      expect(all).toEqual([]);
    });

    it("should return copy of all users", () => {
      const user1: User = {
        id: "1",
        name: "User 1",
        email: "user1@example.com",
        type: "user",
        passwordHash: "hash1",
      };
      const user2: User = {
        id: "2",
        name: "User 2",
        email: "user2@example.com",
        type: "admin",
        passwordHash: "hash2",
      };
      store.push(user1, user2);

      const all = repository.findAll();

      expect(all).toEqual([user1, user2]);
      expect(all).not.toBe(store);
    });
  });

  describe("create", () => {
    it("should create user with generated id and persist to store", () => {
      const input = {
        name: "New User",
        email: "new@example.com",
        type: "user" as const,
        password: "password123",
      };

      const created = repository.create(input, "hashedPassword");

      expect(created).toEqual({
        id: "1",
        name: "New User",
        email: "new@example.com",
        type: "user",
        passwordHash: "hashedPassword",
      });
      expect(store).toHaveLength(1);
      expect(store[0]).toEqual(created);
    });

    it("should generate incremental ids", () => {
      const existingUser: User = {
        id: "5",
        name: "Existing",
        email: "existing@example.com",
        type: "user",
        passwordHash: "hash",
      };
      store.push(existingUser);

      const input = {
        name: "New User",
        email: "new@example.com",
        type: "user" as const,
        password: "password123",
      };

      const created = repository.create(input, "hashedPassword");

      expect(created.id).toBe("6");
    });
  });

  describe("update", () => {
    it("should update user fields and return updated user", () => {
      const user: User = {
        id: "1",
        name: "Original Name",
        email: "original@example.com",
        type: "user",
        passwordHash: "originalHash",
      };
      store.push(user);

      const updated = repository.update(
        "1",
        { name: "Updated Name", email: "updated@example.com" },
        undefined
      );

      expect(updated).toEqual({
        id: "1",
        name: "Updated Name",
        email: "updated@example.com",
        type: "user",
        passwordHash: "originalHash",
      });
    });

    it("should update password hash when provided", () => {
      const user: User = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        type: "user",
        passwordHash: "oldHash",
      };
      store.push(user);

      const updated = repository.update("1", {}, "newHash");

      expect(updated?.passwordHash).toBe("newHash");
    });

    it("should return undefined when user does not exist", () => {
      const updated = repository.update("999", { name: "Test" }, undefined);

      expect(updated).toBeUndefined();
    });
  });

  describe("remove", () => {
    it("should remove user and return true", () => {
      const user: User = {
        id: "1",
        name: "Test User",
        email: "test@example.com",
        type: "user",
        passwordHash: "hash",
      };
      store.push(user);

      const result = repository.remove("1");

      expect(result).toBe(true);
      expect(store).toHaveLength(0);
    });

    it("should return false when user does not exist", () => {
      const result = repository.remove("999");

      expect(result).toBe(false);
    });
  });
});
