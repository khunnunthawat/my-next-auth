import * as z from 'zod';

// ============================================================================
// Schemas
// ============================================================================
export const emailSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
});

export const otpSchema = z.object({
  otp: z.string().length(6, { message: 'Must be 6 digits' }),
});

// ============================================================================
// Types
// ============================================================================
export type AuthFormValues = {
  email: string;
  otp?: string;
};

// ============================================================================
// Enums
// ============================================================================
export enum AuthAction {
  LOGIN = 'login',
  REGISTER = 'register',
}

export enum AuthStep {
  EMAIL = 'email',
  OTP = 'otp',
}
