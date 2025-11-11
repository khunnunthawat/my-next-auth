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
import { REGEXP_ONLY_DIGITS } from 'input-otp';

export interface OtpStepSectionProps {
  form: UseFormReturn<AuthFormValues>;
  action: AuthAction;
  isSubmitting: boolean;
  otpTimeout: number;
  resendCountdown: number;
  resendDisabled: boolean;
  onResendOtp: () => void;
  onBackToEmail: () => void;
  userMessage?: string;
  refCode?: string;
}

export function OtpStepSection({
  form,
  action,
  isSubmitting,
  otpTimeout,
  resendCountdown,
  resendDisabled,
  onResendOtp,
  onBackToEmail,
  userMessage,
  refCode,
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
      {userMessage && (
        <div className='mb-2 p-3 rounded-md bg-muted/50 border border-border'>
          <p className='text-sm font-medium text-foreground'>{userMessage}</p>
        </div>
      )}
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
        render={({ field, fieldState }) => {
          const hasError = !!fieldState.error;
          return (
            <FormItem>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  disabled={field.disabled}
                  inputMode='numeric'
                  pattern={REGEXP_ONLY_DIGITS}
                  aria-invalid={hasError}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} aria-invalid={hasError} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={1} aria-invalid={hasError} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={2} aria-invalid={hasError} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={3} aria-invalid={hasError} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={4} aria-invalid={hasError} />
                  </InputOTPGroup>
                  <InputOTPGroup>
                    <InputOTPSlot index={5} aria-invalid={hasError} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      {refCode && (
        <div className='mb-2 p-2 rounded-md bg-muted/30 border border-border'>
          <span className='text-xs text-muted-foreground'>Ref: </span>
          <span className='text-sm font-mono font-semibold text-foreground'>
            {refCode}
          </span>
        </div>
      )}
      <div className='flex justify-between items-center text-sm text-muted-foreground'>
        <div className='flex items-center gap-2'>
          <Timer className='h-4 w-4' />
          <span>{otpTimeout > 0 ? formatTime(otpTimeout) : 'Expired'}</span>
          <span>{formatTime(otpTimeout)}</span>
        </div>
        <Button
          variant='link'
          type='button'
          onClick={onResendOtp}
          disabled={resendDisabled}
        >
          {resendCountdown > 0
            ? `Resend code (${resendCountdown}s)`
            : 'Resend code'}
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
