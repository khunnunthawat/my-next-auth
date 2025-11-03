import { NextRequest, NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/otp-store';

/**
 * Demo OTP Verification Endpoint
 * POST /api/demo-otp/verify
 *
 * Verifies the OTP code for the provided email address.
 * Returns success if the code matches and hasn't expired.
 *
 * ⚠️ PRODUCTION WARNING:
 * - Implement rate limiting (e.g., max 5 attempts per OTP)
 * - Lock account after too many failed attempts
 * - Log verification attempts for security audit
 * - Use database transactions for user creation/updates
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    // Validate inputs
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!otp || typeof otp !== 'string') {
      return NextResponse.json(
        { success: false, error: 'OTP is required' },
        { status: 400 }
      );
    }

    // Verify OTP length
    if (otp.length !== 6) {
      return NextResponse.json(
        { success: false, error: 'OTP must be 6 digits' },
        { status: 400 }
      );
    }

    // Verify the OTP
    const verification = verifyOtp(email, otp);

    if (!verification.success) {
      return NextResponse.json(
        { success: false, error: verification.error },
        { status: 401 }
      );
    }

    // OTP verified successfully
    // In production, you would:
    // 1. Create or update user in database
    // 2. Generate proper session tokens
    // 3. Set secure HTTP-only cookies
    return NextResponse.json(
      {
        success: true,
        message: 'OTP verified successfully',
        user: {
          email,
          // Additional user data would come from database in production
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Demo OTP Verify] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
