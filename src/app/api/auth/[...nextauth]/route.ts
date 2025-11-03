import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * NextAuth API Route Handler
 * Handles all authentication requests for both Google OAuth and Credentials (Email + OTP)
 *
 * Routes handled:
 * - POST /api/auth/signin/google - Google OAuth flow
 * - POST /api/auth/signin/credentials - Email + OTP flow
 * - POST /api/auth/signout - Sign out
 * - GET /api/auth/session - Get current session
 * - GET /api/auth/csrf - CSRF token
 * - GET /api/auth/providers - List configured providers
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
