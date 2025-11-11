import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================================================
// Thai ID Card Validation
// ============================================================================

/**
 * Validates Thai National ID Card number using the MOD 11 checksum algorithm
 * Thai ID cards are 13 digits with the last digit being a check digit
 *
 * @param idCard - 13-digit Thai ID card number as string
 * @returns true if valid, false otherwise
 */
export function validateThaiIdCard(idCard: string): boolean {
  // Check if input is exactly 13 digits
  if (!/^\d{13}$/.test(idCard)) {
    return false;
  }

  // Calculate checksum using MOD 11 algorithm
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(idCard.charAt(i)) * (13 - i);
  }

  const checkDigit = (11 - (sum % 11)) % 10;
  const lastDigit = parseInt(idCard.charAt(12));

  return checkDigit === lastDigit;
}

/**
 * Checks if a string is a valid Thai ID card (13 digits)
 * @param value - String to check
 * @returns true if it's a 13-digit number, false otherwise
 */
export function isThaiIdCardFormat(value: string): boolean {
  return /^\d{13}$/.test(value.trim());
}

/**
 * Checks if a string is a valid email format
 * @param value - String to check
 * @returns true if it looks like an email, false otherwise
 */
export function isEmailFormat(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Validates if input is either a valid email or a valid Thai ID card
 * @param value - String to validate
 * @returns object with validation result and type
 */
export function validateEmailOrThaiId(value: string): {
  isValid: boolean;
  type: 'email' | 'thai-id' | 'unknown';
  message?: string;
} {
  const trimmedValue = value.trim();

  // Check if it's an email
  if (isEmailFormat(trimmedValue)) {
    return { isValid: true, type: 'email' };
  }

  // Check if it's a Thai ID card format
  if (isThaiIdCardFormat(trimmedValue)) {
    const isValidChecksum = validateThaiIdCard(trimmedValue);
    return {
      isValid: isValidChecksum,
      type: 'thai-id',
      message: isValidChecksum ? undefined : 'Invalid Thai ID card number',
    };
  }

  // Neither format recognized
  return {
    isValid: false,
    type: 'unknown',
    message: 'Enter a valid email address or 13-digit Thai ID card number',
  };
}
