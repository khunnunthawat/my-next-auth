/**
 * In-memory OTP store for demo purposes
 *
 * ⚠️ PRODUCTION WARNING: This is for demonstration only!
 * In production, use a proper database (Redis/PostgreSQL) and send real OTPs via email service
 */

interface OtpEntry {
  code: string;
  refCode: string;
  expiresAt: Date;
  issuedAt: Date;
}

// In-memory store keyed by email or Thai ID (normalized to lowercase)
const otpStore: Map<string, OtpEntry> = new Map();

// Demo OTP code (fixed for development)
const DEMO_OTP = '123456';
const OTP_VALIDITY_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Generates a random 6-character alphanumeric reference code
 * @returns A 6-character reference code (uppercase letters and numbers)
 */
function generateRefCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let refCode = '';
  for (let i = 0; i < 6; i++) {
    refCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return refCode;
}

/**
 * Issues a new OTP for the given email or Thai ID
 * @param email - User's email address or Thai ID card number
 * @returns Object containing the OTP code and reference code
 */
export function issueOtp(email: string): { code: string; refCode: string } {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + OTP_VALIDITY_MS);
  const refCode = generateRefCode();

  // Normalize identifier (lowercase for emails, keep Thai ID as-is if numeric)
  const normalizedIdentifier = email.toLowerCase();

  otpStore.set(normalizedIdentifier, {
    code: DEMO_OTP,
    refCode,
    expiresAt,
    issuedAt: now,
  });

  console.log(
    `[OTP Store] Issued OTP for ${normalizedIdentifier}, RefCode: ${refCode}, expires at ${expiresAt.toISOString()}`
  );

  return { code: DEMO_OTP, refCode };
}

/**
 * Verifies the OTP for the given email or Thai ID
 * @param email - User's email address or Thai ID card number
 * @param code - The OTP code to verify
 * @returns Object with success status and optional error message
 */
export function verifyOtp(
  email: string,
  code: string
): {
  success: boolean;
  error?: string;
} {
  // Normalize identifier (lowercase for emails, keep Thai ID as-is if numeric)
  const normalizedIdentifier = email.toLowerCase();
  const entry = otpStore.get(normalizedIdentifier);

  if (!entry) {
    return { success: false, error: 'No OTP found for this email' };
  }

  const now = new Date();
  if (now > entry.expiresAt) {
    otpStore.delete(normalizedIdentifier);
    return { success: false, error: 'OTP has expired' };
  }

  if (entry.code !== code) {
    return { success: false, error: 'Invalid OTP code' };
  }

  // Success! Remove the OTP to prevent reuse
  otpStore.delete(normalizedIdentifier);
  console.log(`[OTP Store] Successfully verified OTP for ${normalizedIdentifier}`);

  return { success: true };
}

/**
 * Checks if an OTP exists and is still valid for the given email or Thai ID
 * @param email - User's email address or Thai ID card number
 * @returns Boolean indicating if valid OTP exists
 */
export function hasValidOtp(email: string): boolean {
  // Normalize identifier (lowercase for emails, keep Thai ID as-is if numeric)
  const normalizedIdentifier = email.toLowerCase();
  const entry = otpStore.get(normalizedIdentifier);
  if (!entry) return false;

  const now = new Date();
  if (now > entry.expiresAt) {
    otpStore.delete(normalizedIdentifier);
    return false;
  }

  return true;
}

/**
 * Cleans up expired OTPs (useful for long-running processes)
 */
export function cleanupExpiredOtps(): void {
  const now = new Date();
  let cleaned = 0;

  for (const [email, entry] of otpStore.entries()) {
    if (now > entry.expiresAt) {
      otpStore.delete(email);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log(`[OTP Store] Cleaned up ${cleaned} expired OTP(s)`);
  }
}

// Cleanup expired OTPs every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredOtps, 10 * 60 * 1000);
}
