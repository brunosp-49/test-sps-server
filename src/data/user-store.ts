import bcrypt from "bcrypt";
import type { User } from "../types/user";

const SALT_ROUNDS = 10;

/**
 * In-memory data store for users.
 * In production, this would be replaced by a database (PostgreSQL, MongoDB, etc.).
 * The in-memory approach is used here as per the test requirements.
 */

// Pre-hash admin password at module load time (only runs once)
const adminPasswordHash = bcrypt.hashSync("1234", SALT_ROUNDS);

/**
 * Factory function to create initial user data.
 * Used both at startup and for resetting the store in tests.
 */
function createInitialUsers(): User[] {
  return [
    {
      id: "1",
      name: "admin",
      email: "admin@spsgroup.com.br",
      type: "admin",
      passwordHash: adminPasswordHash,
    },
  ];
}

// Exported mutable array - the repository operates on this reference
export const userStore: User[] = createInitialUsers();

/**
 * Resets the store to initial state.
 * Used in integration tests to ensure test isolation.
 * Mutates the array in place to preserve the reference used by the repository.
 */
export function resetUserStore(): void {
  userStore.length = 0;
  userStore.push(...createInitialUsers());
}
