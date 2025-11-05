import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { verifyOtp } from './otp-store';
import { userExists, createUser, getUserByEmail } from './user-store';

/**
 * NextAuth Configuration
 * Implements Google OAuth and OTP-based credentials authentication
 */
export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),

    // Credentials Provider for Email + OTP
    CredentialsProvider({
      id: 'credentials',
      name: 'Email + OTP',
      credentials: {
        email: { label: 'Email', type: 'email' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.otp) {
          throw new Error('Email and OTP are required');
        }

        // Verify the OTP
        const verification = verifyOtp(credentials.email, credentials.otp);

        if (!verification.success) {
          throw new Error(verification.error || 'Invalid OTP');
        }

        // OTP verified successfully
        // Check if user exists
        const exists = userExists(credentials.email);

        let user;
        if (exists) {
          // Login flow: Get existing user
          user = getUserByEmail(credentials.email);
          if (!user) {
            throw new Error('User not found');
          }
          console.log(`[Auth] User logged in: ${user.email}`);
        } else {
          // Registration flow: Create new user
          user = createUser(
            credentials.email,
            credentials.email.split('@')[0] // Extract name from email for demo
          );
          console.log(`[Auth] New user registered: ${user.email}`);
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || user.email.split('@')[0],
        };
      },
    }),
  ],

  // JWT strategy for session management
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // JWT token callbacks
  callbacks: {
    async signIn({ user, account }) {
      // Handle Google sign-in: create user if doesn't exist
      if (account?.provider === 'google' && user.email) {
        const exists = userExists(user.email);
        if (!exists) {
          createUser(user.email, user.name || user.email.split('@')[0]);
          console.log(`[Auth] New user registered via Google: ${user.email}`);
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name || '';
      }

      // Add demo accessToken (just a nonce for demonstration)
      // ⚠️ In production, use proper token generation or omit this
      if (account && !token.accessToken) {
        token.accessToken = `demo-token-${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}`;
      }

      return token;
    },

    async session({ session, token }) {
      // Pass token data to session
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name || '';

        // ⚠️ Demo only: Expose accessToken to client
        // In production, NEVER expose sensitive tokens to the client
        if (process.env.NEXT_PUBLIC_MIRROR_SESSION_TO_STORAGE === 'true') {
          session.accessToken = token.accessToken;
        }
      }

      return session;
    },
  },

  pages: {
    signIn: '/', // Use home page for auth dialogs
    error: '/', // Redirect errors to home
  },

  // Enable debug in development
  debug: process.env.NODE_ENV === 'development',

  // Secret for JWT signing
  secret: process.env.NEXTAUTH_SECRET,
};
