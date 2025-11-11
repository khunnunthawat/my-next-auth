import { NextRequest, NextResponse } from 'next/server';
import { userExists } from '@/lib/user-store';
import { issueOtp } from '@/lib/otp-store';
import { z } from 'zod';
import { validateEmailOrThaiId } from '@/lib/utils';

/**
 * API Route: Check Existing Email or Thai ID (Case 1)
 *
 * This route checks if an email or Thai ID card already exists in the system.
 * If it exists, it issues an OTP for login.
 *
 * Response includes:
 * - exists: boolean indicating if email/Thai ID is registered
 * - message: descriptive message for the UI
 * - userMessage: message to display in the OTP step header
 */

const requestSchema = z.object({
  email: z.string().refine(
    (value) => {
      const validation = validateEmailOrThaiId(value);
      return validation.isValid;
    },
    {
      message: 'Enter a valid email address or 13-digit Thai ID card number.',
    }
  ),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = requestSchema.parse(body);

    const exists = userExists(email);

    if (exists) {
      // Case 1: Email/Thai ID exists - issue OTP for login
      const { code: otpCode, refCode } = issueOtp(email);
      console.log(`[Check Existing] Identifier exists: ${email}, OTP: ${otpCode}, RefCode: ${refCode}`);

      return NextResponse.json({
        success: true,
        exists: true,
        message: 'OTP sent to existing account',
        userMessage: 'This account already exists with my-next-auth.',
        refCode,
        // In production, don't include the actual OTP in the response
        ...(process.env.NODE_ENV === 'development' && { otp: otpCode }),
      });
    } else {
      // Email/Thai ID doesn't exist - inform the client without issuing OTP
      console.log(`[Check Existing] Identifier not found: ${email}`);

      return NextResponse.json({
        success: true,
        exists: false,
        message: 'Account not registered',
        userMessage: 'Create account my-next-auth.',
      });
    }
  } catch (error) {
    console.error('[Check Existing] Error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or Thai ID card format',
          exists: false
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check account',
        exists: false
      },
      { status: 500 }
    );
  }
}
