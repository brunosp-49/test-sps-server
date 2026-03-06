import request from "supertest";
import app from "./app";
import { resetUserStore } from "./data/user-store";
import { ErrorCodes } from "./constants/error-codes";

describe("API Integration Tests", () => {
  beforeEach(() => {
    resetUserStore();
  });

  describe("GET /", () => {
    it("should return Hello World", async () => {
      const response = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.text).toBe("Hello World!");
    });
  });

  describe("GET /health", () => {
    it("should return status ok", async () => {
      const response = await request(app).get("/health");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: "ok" });
    });
  });

  describe("POST /auth", () => {
    it("should return token and user with valid credentials", async () => {
      const response = await request(app)
        .post("/auth")
        .send({ email: "admin@spsgroup.com.br", password: "1234" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.user).toEqual({
        id: "1",
        name: "admin",
        email: "admin@spsgroup.com.br",
        type: "admin",
      });
    });

    it("should return 400 with validation error for invalid body", async () => {
      const response = await request(app)
        .post("/auth")
        .send({ email: "not-an-email", password: "" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(ErrorCodes.validationFailed);
      expect(response.body.details).toBeDefined();
    });

    it("should return 401 with invalid credentials error for wrong password", async () => {
      const response = await request(app)
        .post("/auth")
        .send({ email: "admin@spsgroup.com.br", password: "wrongpassword" });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe(ErrorCodes.invalidCredentials);
    });

    it("should return 401 with invalid credentials error for non-existent email", async () => {
      const response = await request(app)
        .post("/auth")
        .send({ email: "nonexistent@example.com", password: "1234" });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe(ErrorCodes.invalidCredentials);
    });
  });

  describe("Protected routes without token", () => {
    it("GET /users should return 401 without authorization header", async () => {
      const response = await request(app).get("/users");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe(ErrorCodes.missingOrInvalidAuthorizationHeader);
    });

    it("POST /users should return 401 without authorization header", async () => {
      const response = await request(app)
        .post("/users")
        .send({ name: "Test", email: "test@test.com", type: "user", password: "123456" });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe(ErrorCodes.missingOrInvalidAuthorizationHeader);
    });

    it("should return 401 with invalid token", async () => {
      const response = await request(app)
        .get("/users")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe(ErrorCodes.invalidOrExpiredToken);
    });

    it("should return 401 with malformed authorization header", async () => {
      const response = await request(app)
        .get("/users")
        .set("Authorization", "NotBearer token");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe(ErrorCodes.missingOrInvalidAuthorizationHeader);
    });
  });

  describe("GET /users (authenticated)", () => {
    let token: string;

    beforeEach(async () => {
      const loginResponse = await request(app)
        .post("/auth")
        .send({ email: "admin@spsgroup.com.br", password: "1234" });
      token = loginResponse.body.token;
    });

    it("should return list of users", async () => {
      const response = await request(app)
        .get("/users")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toEqual({
        id: "1",
        name: "admin",
        email: "admin@spsgroup.com.br",
        type: "admin",
      });
    });
  });

  describe("POST /users (authenticated)", () => {
    let token: string;

    beforeEach(async () => {
      const loginResponse = await request(app)
        .post("/auth")
        .send({ email: "admin@spsgroup.com.br", password: "1234" });
      token = loginResponse.body.token;
    });

    it("should create user with valid data", async () => {
      const response = await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "New User",
          email: "newuser@example.com",
          type: "user",
          password: "password123",
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: "2",
        name: "New User",
        email: "newuser@example.com",
        type: "user",
      });
      expect(response.body).not.toHaveProperty("password");
      expect(response.body).not.toHaveProperty("passwordHash");
    });

    it("should return 400 with validation error for invalid data", async () => {
      const response = await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "",
          email: "invalid-email",
          type: "invalid-type",
          password: "",
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(ErrorCodes.validationFailed);
      expect(response.body.details).toBeDefined();
    });

    it("should return 400 when email is already registered", async () => {
      const response = await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Another Admin",
          email: "admin@spsgroup.com.br",
          type: "user",
          password: "password123",
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(ErrorCodes.emailAlreadyRegistered);
    });
  });

  describe("GET /users/:id (authenticated)", () => {
    let token: string;

    beforeEach(async () => {
      const loginResponse = await request(app)
        .post("/auth")
        .send({ email: "admin@spsgroup.com.br", password: "1234" });
      token = loginResponse.body.token;
    });

    it("should return user when id exists", async () => {
      const response = await request(app)
        .get("/users/1")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: "1",
        name: "admin",
        email: "admin@spsgroup.com.br",
        type: "admin",
      });
    });

    it("should return 404 when user does not exist", async () => {
      const response = await request(app)
        .get("/users/999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe(ErrorCodes.userNotFound);
    });
  });

  describe("PUT /users/:id (authenticated)", () => {
    let token: string;

    beforeEach(async () => {
      const loginResponse = await request(app)
        .post("/auth")
        .send({ email: "admin@spsgroup.com.br", password: "1234" });
      token = loginResponse.body.token;
    });

    it("should update user with valid data", async () => {
      const response = await request(app)
        .put("/users/1")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Updated Admin" });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe("Updated Admin");
    });

    it("should return 404 when user does not exist", async () => {
      const response = await request(app)
        .put("/users/999")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Test" });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe(ErrorCodes.userNotFound);
    });

    it("should return 400 when email is already in use by another user", async () => {
      await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "User 2",
          email: "user2@example.com",
          type: "user",
          password: "password123",
        });

      const response = await request(app)
        .put("/users/1")
        .set("Authorization", `Bearer ${token}`)
        .send({ email: "user2@example.com" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(ErrorCodes.emailAlreadyInUse);
    });
  });

  describe("DELETE /users/:id (authenticated)", () => {
    let token: string;

    beforeEach(async () => {
      const loginResponse = await request(app)
        .post("/auth")
        .send({ email: "admin@spsgroup.com.br", password: "1234" });
      token = loginResponse.body.token;
    });

    it("should delete user and return 204", async () => {
      await request(app)
        .post("/users")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "To Delete",
          email: "todelete@example.com",
          type: "user",
          password: "password123",
        });

      const response = await request(app)
        .delete("/users/2")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(204);

      const getResponse = await request(app)
        .get("/users/2")
        .set("Authorization", `Bearer ${token}`);
      expect(getResponse.status).toBe(404);
    });

    it("should return 404 when user does not exist", async () => {
      const response = await request(app)
        .delete("/users/999")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe(ErrorCodes.userNotFound);
    });
  });
});
