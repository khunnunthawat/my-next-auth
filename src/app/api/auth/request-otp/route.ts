import { NextRequest, NextResponse } from 'next/server';
import { issueOtp } from '@/lib/otp-store';
import { z } from 'zod';

const requestSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = requestSchema.parse(body);

    // Issue OTP for the email
    const otpCode = issueOtp(email);

    console.log(`[Request OTP] Generated OTP for ${email}: ${otpCode}`);

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      // In production, don't include the actual OTP in the response
      ...(process.env.NODE_ENV === 'development' && { otp: otpCode }),
    });
  } catch (error) {
    console.error('[Request OTP] Error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
