/**
 * In-memory OTP store for demo purposes
 *
 * ⚠️ PRODUCTION WARNING: This is for demonstration only!
 * In production, use a proper database (Redis/PostgreSQL) and send real OTPs via email service
 */

interface OtpEntry {
  code: string;
  expiresAt: Date;
  issuedAt: Date;
}

// In-memory store keyed by email
const otpStore: Map<string, OtpEntry> = new Map();

// Demo OTP code (fixed for development)
const DEMO_OTP = '123456';
const OTP_VALIDITY_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Issues a new OTP for the given email
 * @param email - User's email address
 * @returns The generated OTP code (always '123456' in demo)
 */
export function issueOtp(email: string): string {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + OTP_VALIDITY_MS);

  otpStore.set(email, {
    code: DEMO_OTP,
    expiresAt,
    issuedAt: now,
  });

  console.log(
    `[OTP Store] Issued OTP for ${email}, expires at ${expiresAt.toISOString()}`
  );

  return DEMO_OTP;
}

/**
 * Verifies the OTP for the given email
 * @param email - User's email address
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
  const entry = otpStore.get(email);

  if (!entry) {
    return { success: false, error: 'No OTP found for this email' };
  }

  const now = new Date();
  if (now > entry.expiresAt) {
    otpStore.delete(email);
    return { success: false, error: 'OTP has expired' };
  }

  if (entry.code !== code) {
    return { success: false, error: 'Invalid OTP code' };
  }

  // Success! Remove the OTP to prevent reuse
  otpStore.delete(email);
  console.log(`[OTP Store] Successfully verified OTP for ${email}`);

  return { success: true };
}

/**
 * Checks if an OTP exists and is still valid for the given email
 * @param email - User's email address
 * @returns Boolean indicating if valid OTP exists
 */
export function hasValidOtp(email: string): boolean {
  const entry = otpStore.get(email);
  if (!entry) return false;

  const now = new Date();
  if (now > entry.expiresAt) {
    otpStore.delete(email);
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
