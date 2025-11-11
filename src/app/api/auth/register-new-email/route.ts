import { NextRequest, NextResponse } from 'next/server';
import { userExists } from '@/lib/user-store';
import { issueOtp } from '@/lib/otp-store';
import { z } from 'zod';

/**
 * API Route: Register New Email (Case 2)
 *
 * This route handles new email registration (EMAIL ONLY).
 * If email doesn't exist, it issues an OTP for registration.
 * If email exists, it redirects to login flow.
 *
 * Note: Registration only supports email addresses, not Thai ID cards.
 *
 * Response includes:
 * - isNew: boolean indicating if this is a new registration
 * - message: descriptive message for the UI
 * - userMessage: message to display in the OTP step header
 */

const requestSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address.' }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = requestSchema.parse(body);

    const exists = userExists(email);

    // Always issue OTP and proceed, but indicate whether user exists
    const { code: otpCode, refCode } = issueOtp(email);

    if (!exists) {
      // Case 2: New account - proceed with registration flow
      console.log(`[Register New] New identifier: ${email}, OTP: ${otpCode}, RefCode: ${refCode}`);

      return NextResponse.json({
        success: true,
        isNew: true,
        exists: false,
        message: 'OTP sent for new registration',
        userMessage: 'Create account my-next-auth.',
        refCode,
        // In production, don't include the actual OTP in the response
        ...(process.env.NODE_ENV === 'development' && { otp: otpCode }),
      });
    } else {
      // Case 1: Account exists - proceed with login flow instead
      console.log(`[Register New] Identifier exists: ${email}, proceeding with login, OTP: ${otpCode}, RefCode: ${refCode}`);

      return NextResponse.json({
        success: true,
        isNew: false,
        exists: true,
        message: 'OTP sent for existing account login',
        userMessage: 'This account already exists with my-next-auth.',
        refCode,
        // In production, don't include the actual OTP in the response
        ...(process.env.NODE_ENV === 'development' && { otp: otpCode }),
      });
    }
  } catch (error) {
    console.error('[Register New] Error:', error);

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

// NOTE: Registration completion is handled in the NextAuth credentials provider
// See src/lib/auth.ts for the complete registration flow
