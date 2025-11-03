import { NextRequest, NextResponse } from 'next/server';
import { issueOtp } from '@/lib/otp-store';

/**
 * Demo OTP Request Endpoint
 * POST /api/demo-otp/request
 *
 * Issues a new OTP for the provided email address.
 * In demo mode, always returns '123456' with a 5-minute expiry.
 *
 * ⚠️ PRODUCTION WARNING:
 * - Implement rate limiting (e.g., max 3 requests per 15 minutes per IP/email)
 * - Generate random 6-digit codes
 * - Send via email service (SendGrid, AWS SES, etc.)
 * - Log requests for security audit
 * - Add CAPTCHA verification
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Issue OTP (stores in memory)
    const otpCode = issueOtp(email);

    // In production, send email here instead of returning the code
    console.log(`[Demo OTP] Code for ${email}: ${otpCode}`);

    return NextResponse.json(
      {
        success: true,
        message: 'OTP sent successfully',
        // ⚠️ NEVER return the OTP in production! This is demo-only
        demo: {
          code: otpCode,
          expiresIn: '5 minutes',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Demo OTP Request] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
