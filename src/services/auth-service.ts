import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { UserRepository } from "../repository/user-repository";

/**
 * JWT configuration.
 * IMPORTANT: In production, JWT_SECRET must be set via environment variable.
 * The fallback is only for development convenience.
 */
const JWT_SECRET = process.env.JWT_SECRET ?? "default-secret-change-in-production";
const JWT_EXPIRES_IN = "7d";

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  token: string;
  user: { id: string; name: string; email: string; type: string };
}

export interface VerifyTokenPayload {
  userId: string;
  email: string;
}

/**
 * Authentication service handling login and token verification.
 * Uses bcrypt for password comparison (timing-attack safe) and JWT for stateless auth.
 */
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Authenticates user and returns JWT token.
   * Security: Returns generic "Invalid credentials" for both wrong email and password
   * to prevent user enumeration attacks.
   */
  login(input: LoginInput): LoginResult {
    const user = this.userRepository.findByEmail(input.email);
    if (!user) throw new Error("Invalid credentials");

    // bcrypt.compareSync is timing-safe, preventing timing attacks
    const isPasswordValid = bcrypt.compareSync(input.password, user.passwordHash);
    if (!isPasswordValid) throw new Error("Invalid credentials");

    // JWT payload contains only non-sensitive user identifiers
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Never return passwordHash to the client
    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, type: user.type },
    };
  }

  /**
   * Verifies JWT token and extracts payload.
   * Throws if token is invalid or expired (handled by middleware).
   */
  verifyToken(token: string): VerifyTokenPayload {
    const payload = jwt.verify(token, JWT_SECRET) as VerifyTokenPayload;
    return payload;
  }
}
