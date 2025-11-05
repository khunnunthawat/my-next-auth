import { NextRequest, NextResponse } from 'next/server';
import { userExists } from '@/lib/user-store';
import { issueOtp } from '@/lib/otp-store';
import { z } from 'zod';

/**
 * API Route: Check Existing Email (Case 1)
 *
 * This route checks if an email already exists in the system.
 * If it exists, it issues an OTP for login.
 *
 * Response includes:
 * - exists: boolean indicating if email is registered
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

    if (exists) {
      // Case 1: Email exists - issue OTP for login
      const otpCode = issueOtp(email);
      console.log(`[Check Existing Email] Email exists: ${email}, OTP: ${otpCode}`);

      return NextResponse.json({
        success: true,
        exists: true,
        message: 'OTP sent to existing account',
        userMessage: 'This email already has an account with my-next-auth.',
        // In production, don't include the actual OTP in the response
        ...(process.env.NODE_ENV === 'development' && { otp: otpCode }),
      });
    } else {
      // Email doesn't exist - inform the client without issuing OTP
      console.log(`[Check Existing Email] Email not found: ${email}`);

      return NextResponse.json({
        success: true,
        exists: false,
        message: 'Email not registered',
        userMessage: 'Create account my-next-auth.',
      });
    }
  } catch (error) {
    console.error('[Check Existing Email] Error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
          exists: false
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check email',
        exists: false
      },
      { status: 500 }
    );
  }
}
