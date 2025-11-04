'use client';

import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { LogIn, Timer, Loader2 } from 'lucide-react';
import { AuthAction, AuthFormValues } from '../types';

export interface OtpStepSectionProps {
  form: UseFormReturn<AuthFormValues>;
  action: AuthAction;
  isSubmitting: boolean;
  otpTimeout: number;
  resendDisabled: boolean;
  onResendOtp: () => void;
  onBackToEmail: () => void;
}

export function OtpStepSection({
  form,
  action,
  isSubmitting,
  otpTimeout,
  resendDisabled,
  onResendOtp,
  onBackToEmail,
}: OtpStepSectionProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <>
      <p className='text-sm text-muted-foreground'>
        An OTP has been sent to{' '}
        <span className='font-medium text-foreground'>
          {form.getValues('email')}
        </span>
        .
      </p>
      <FormField
        control={form.control}
        name='otp'
        render={({ field }) => (
          <FormItem>
            <FormLabel>One-Time Password</FormLabel>
            <FormControl>
              <InputOTP
                maxLength={6}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                disabled={field.disabled}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                </InputOTPGroup>
                <InputOTPGroup>
                  <InputOTPSlot index={1} />
                </InputOTPGroup>
                <InputOTPGroup>
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
                <InputOTPGroup>
                  <InputOTPSlot index={4} />
                </InputOTPGroup>
                <InputOTPGroup>
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className='flex justify-between items-center text-sm text-muted-foreground'>
        <div className='flex items-center gap-2'>
          <Timer className='h-4 w-4' />
          <span>{otpTimeout > 0 ? formatTime(otpTimeout) : 'Expired'}</span>
        </div>
        <Button
          variant='link'
          type='button'
          onClick={onResendOtp}
          disabled={resendDisabled || otpTimeout > 298}
        >
          Resend code
        </Button>
      </div>
      <div className='flex flex-col gap-2'>
        <Button
          type='submit'
          className='w-full'
          disabled={isSubmitting || otpTimeout === 0}
        >
          {isSubmitting ? (
            <Loader2 className='animate-spin' />
          ) : (
            <LogIn className='mr-2' />
          )}
          {!isSubmitting &&
            (action === AuthAction.LOGIN
              ? 'Verify & Sign In'
              : 'Verify & Register')}
        </Button>
        <Button variant='outline' className='w-full' onClick={onBackToEmail}>
          Back to email
        </Button>
      </div>
    </>
  );
}
