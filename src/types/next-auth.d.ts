import 'next-auth';
import 'next-auth/jwt';

/**
 * Extend NextAuth type definitions
 * This adds custom properties to the session and JWT token
 */
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
    };
    accessToken?: string; // Demo token (not for production)
  }

  interface User {
    id: string;
    email: string;
    name?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    accessToken?: string; // Demo token (not for production)
  }
}
