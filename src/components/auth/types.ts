import * as z from 'zod';
import { validateEmailOrThaiId } from '@/lib/utils';

// ============================================================================
// Validation Messages
// ============================================================================
export const OTP_MESSAGES = {
  REQUIRED: 'Enter OTP code.',
  INVALID: 'OTP code is invalid, try again.',
  EXPIRED: 'OTP code has expired.',
} as const;

// ============================================================================
// Schemas
// ============================================================================

// Schema for LOGIN - accepts email OR Thai ID card
export const emailOrThaiIdSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email or Thai ID card is required.' })
    .refine(
      (value) => {
        const validation = validateEmailOrThaiId(value);
        return validation.isValid;
      },
      {
        message: 'Enter a valid email address or 13-digit Thai ID card number.',
      }
    ),
});

// Schema for REGISTER - accepts email ONLY
export const emailOnlySchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required.' })
    .email({ message: 'Enter a valid email address.' }),
});

// Default export for backward compatibility (login schema)
export const emailSchema = emailOrThaiIdSchema;

export const otpSchema = z.object({
  otp: z
    .string()
    .min(1, { message: OTP_MESSAGES.REQUIRED })
    .min(6, { message: OTP_MESSAGES.REQUIRED })
    .max(6, { message: OTP_MESSAGES.REQUIRED }),
});

// ============================================================================
// Types
// ============================================================================
export type AuthFormValues = {
  email: string;
  otp: string;
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
