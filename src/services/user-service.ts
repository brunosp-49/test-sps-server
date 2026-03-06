import bcrypt from "bcrypt";
import type { CreateUserInput, UpdateUserInput, UserResponse, UserType } from "../types/user";
import type { UserRepository } from "../repository/user-repository";

/**
 * bcrypt salt rounds for password hashing.
 * Higher = more secure but slower. 10-12 is recommended for production.
 */
const SALT_ROUNDS = 10;

/**
 * User Service - Business logic layer for user operations.
 * Implements CRUD operations with business rules:
 * - Email uniqueness validation
 * - Password hashing before storage
 * - Response sanitization (no password hash in output)
 */
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Creates a new user with hashed password.
   * Validates email uniqueness before creation.
   */
  registerUser(input: CreateUserInput): UserResponse {
    const existing = this.userRepository.findByEmail(input.email);
    if (existing) throw new Error("Email already registered");

    // Hash password before storing - never store plain text passwords
    const passwordHash = bcrypt.hashSync(input.password, SALT_ROUNDS);
    const user = this.userRepository.create(input, passwordHash);
    return this.toResponse(user);
  }

  /**
   * Updates user data with partial update support.
   * Validates email uniqueness if email is being changed,
   * but allows user to keep their current email.
   */
  updateUser(userId: string, input: UpdateUserInput): UserResponse {
    const existing = this.userRepository.findById(userId);
    if (!existing) throw new Error("User not found");

    // Check email uniqueness only if email is being changed
    if (input.email !== undefined) {
      const byEmail = this.userRepository.findByEmail(input.email);
      // Allow if no user has this email, or if it's the same user (keeping their email)
      if (byEmail && byEmail.id !== userId) throw new Error("Email already in use");
    }

    // Only hash password if it's being updated
    const passwordHash = input.password
      ? bcrypt.hashSync(input.password, SALT_ROUNDS)
      : undefined;

    const updated = this.userRepository.update(userId, input, passwordHash);
    if (!updated) throw new Error("User not found");
    return this.toResponse(updated);
  }

  deleteUser(userId: string): void {
    const removed = this.userRepository.remove(userId);
    if (!removed) throw new Error("User not found");
  }

  getUserById(userId: string): UserResponse | undefined {
    const user = this.userRepository.findById(userId);
    return user ? this.toResponse(user) : undefined;
  }

  listUsers(): UserResponse[] {
    return this.userRepository.findAll().map((u) => this.toResponse(u));
  }

  /**
   * Sanitizes user data for API responses.
   * IMPORTANT: Excludes passwordHash to prevent leaking sensitive data.
   */
  private toResponse(user: { id: string; name: string; email: string; type: UserType }): UserResponse {
    return { id: user.id, name: user.name, email: user.email, type: user.type };
  }
}
