import type { User, CreateUserInput, UpdateUserInput } from "../types/user";

/**
 * Repository Pattern implementation for User entity.
 * Abstracts data access from business logic, making it easy to:
 * - Swap storage implementation (e.g., from in-memory to database)
 * - Mock in unit tests
 * - Keep services focused on business rules
 */
export class UserRepository {
  constructor(private readonly store: User[]) {}

  /**
   * Case-insensitive email lookup to prevent duplicate registrations
   * with different casing (e.g., "User@email.com" vs "user@email.com")
   */
  findByEmail(email: string): User | undefined {
    return this.store.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findById(id: string): User | undefined {
    return this.store.find((u) => u.id === id);
  }

  /**
   * Returns a shallow copy to prevent external mutation of the store.
   * In a real database scenario, this would be a SELECT * query.
   */
  findAll(): User[] {
    return [...this.store];
  }

  create(input: CreateUserInput, passwordHash: string): User {
    const user: User = {
      id: this.generateId(),
      name: input.name,
      email: input.email,
      type: input.type,
      passwordHash,
    };
    this.store.push(user);
    return user;
  }

  /**
   * Partial update: only updates fields that are provided.
   * Uses nullish coalescing (??) to preserve existing values.
   */
  update(id: string, input: UpdateUserInput, passwordHash?: string): User | undefined {
    const index = this.store.findIndex((u) => u.id === id);
    if (index === -1) return undefined;
    const current = this.store[index];
    this.store[index] = {
      ...current,
      name: input.name ?? current.name,
      email: input.email ?? current.email,
      type: input.type ?? current.type,
      passwordHash: passwordHash ?? current.passwordHash,
    };
    return this.store[index];
  }

  remove(id: string): boolean {
    const index = this.store.findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.store.splice(index, 1);
    return true;
  }

  /**
   * Simple auto-increment ID generator.
   * In production with a database, this would be handled by the DB (e.g., SERIAL, UUID).
   */
  private generateId(): string {
    const maxId = this.store.reduce((max, u) => Math.max(max, Number(u.id) || 0), 0);
    return String(maxId + 1);
  }
}
