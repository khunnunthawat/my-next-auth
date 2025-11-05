/**
 * In-memory user store for demo purposes
 *
 * ⚠️ PRODUCTION WARNING: This is for demonstration only!
 * In production, use a proper database (PostgreSQL, MongoDB, etc.)
 */

interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

// In-memory store keyed by email
const userStore: Map<string, User> = new Map();

// Demo: Add some existing users for testing
userStore.set('test@gmail.com', {
  id: '1',
  email: 'test@gmail.com',
  name: 'Test User',
  createdAt: new Date(),
});

/**
 * Checks if a user with the given email exists
 * @param email - User's email address
 * @returns Boolean indicating if user exists
 */
export function userExists(email: string): boolean {
  return userStore.has(email.toLowerCase());
}

/**
 * Creates a new user with the given email
 * @param email - User's email address
 * @param name - Optional user name
 * @returns The created user object
 */
export function createUser(email: string, name?: string): User {
  const normalizedEmail = email.toLowerCase();

  if (userStore.has(normalizedEmail)) {
    throw new Error('User already exists');
  }

  const user: User = {
    id: Date.now().toString(),
    email: normalizedEmail,
    name,
    createdAt: new Date(),
  };

  userStore.set(normalizedEmail, user);
  console.log(`[User Store] Created user: ${normalizedEmail}`);

  return user;
}

/**
 * Gets a user by email
 * @param email - User's email address
 * @returns The user object or undefined if not found
 */
export function getUserByEmail(email: string): User | undefined {
  return userStore.get(email.toLowerCase());
}

/**
 * Gets all users (for debugging)
 * @returns Array of all users
 */
export function getAllUsers(): User[] {
  return Array.from(userStore.values());
}
