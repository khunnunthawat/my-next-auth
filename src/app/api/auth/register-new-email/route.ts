import { NextRequest, NextResponse } from 'next/server';
import { userExists, createUser } from '@/lib/user-store';
import { issueOtp } from '@/lib/otp-store';
import { z } from 'zod';

/**
 * API Route: Register New Email (Case 2)
 *
 * This route handles new email registration.
 * If email doesn't exist, it issues an OTP for registration.
 * If email exists, it redirects to login flow.
 *
 * Response includes:
 * - isNew: boolean indicating if this is a new registration
 * - message: descriptive message for the UI
 * - userMessage: message to display in the OTP step header
 */

const requestSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = requestSchema.parse(body);

    const exists = userExists(email);

    // Always issue OTP and proceed, but indicate whether user exists
    const otpCode = issueOtp(email);

    if (!exists) {
      // Case 2: New email - proceed with registration flow
      console.log(`[Register New Email] New email: ${email}, OTP: ${otpCode}`);

      return NextResponse.json({
        success: true,
        isNew: true,
        exists: false,
        message: 'OTP sent for new registration',
        userMessage: 'Create account my-next-auth.',
        // In production, don't include the actual OTP in the response
        ...(process.env.NODE_ENV === 'development' && { otp: otpCode }),
      });
    } else {
      // Case 1: Email exists - proceed with login flow instead
      console.log(`[Register New Email] Email exists: ${email}, proceeding with login, OTP: ${otpCode}`);

      return NextResponse.json({
        success: true,
        isNew: false,
        exists: true,
        message: 'OTP sent for existing account login',
        userMessage: 'This email already has an account with my-next-auth.',
        // In production, don't include the actual OTP in the response
        ...(process.env.NODE_ENV === 'development' && { otp: otpCode }),
      });
    }
  } catch (error) {
    console.error('[Register New Email] Error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
          isNew: false,
          exists: false
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process registration',
        isNew: false,
        exists: false
      },
      { status: 500 }
    );
  }
}

/**
 * Complete registration after OTP verification
 * This would typically be called from the credentials provider
 */
export function completeRegistration(email: string, name?: string) {
  try {
    const user = createUser(email, name);
    console.log(`[Register New Email] Registration completed for: ${email}`);
    return { success: true, user };
  } catch (error) {
    console.error('[Register New Email] Registration failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed'
    };
  }
}
