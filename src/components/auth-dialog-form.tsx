'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { LogIn, ArrowRight, Timer, Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';

const emailSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
});

const otpSchema = z.object({
  otp: z.string().length(6, { message: 'Must be 6 digits' }),
});

export type AuthFormValues = {
  email: string;
  otp?: string;
};

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg role='img' viewBox='0 0 24 24' {...props}>
    <path
      fill='currentColor'
      d='M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.86 2.25-5.02 2.25-4.83 0-8.6-3.8-8.6-8.6s3.77-8.6 8.6-8.6c2.53 0 4.22.98 5.17 1.89l2.4-2.4C18.96 3.24 16.1 2 12.48 2 7.1 2 3.08 6.13 3.08 11.5s4.02 9.5 9.4 9.5c3.1 0 5.49-1.02 7.22-2.77 1.8-1.8 2.54-4.34 2.54-6.55 0-.9-.08-1.4-.18-1.82H12.48z'
    />
  </svg>
);

interface AuthFormProps {
  action: 'login' | 'register';
  onSuccess: () => void;
}

export function AuthForm({ action, onSuccess }: AuthFormProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [otpTimeout, setOtpTimeout] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const { data: session } = useSession();

  const currentResolver =
    step === 'email'
      ? emailSchema
      : z.object({ email: emailSchema.shape.email, otp: otpSchema.shape.otp });

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(currentResolver),
    defaultValues: { email: '', otp: '' },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpTimeout > 0) {
      setResendDisabled(true);
      timer = setTimeout(() => setOtpTimeout(otpTimeout - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [otpTimeout]);

  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_MIRROR_SESSION_TO_STORAGE === 'true' &&
      session?.accessToken
    ) {
      sessionStorage.setItem('session.accessToken', session.accessToken);
    }
  }, [session]);

  const startOtpTimer = () => {
    setOtpTimeout(300); // 5 minutes
    setTimeout(() => setResendDisabled(false), 2000); // Enable resend after 2s
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleSubmitting(true);
    await signIn('google', { callbackUrl: '/' });
    setIsGoogleSubmitting(false);
  };

  const requestOtp = async (values: Pick<AuthFormValues, 'email'>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      toast.info('OTP Sent (Demo)', {
        description: `An OTP has been sent to ${values.email}. Use '123456'.`,
      });
      setStep('otp');
      startOtpTimer();
    } catch (error: unknown) {
      toast.error('Failed to send OTP', {
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
      });
    }
    setIsSubmitting(false);
  };

  const onFinalSubmit = async (values: AuthFormValues) => {
    setIsSubmitting(true);
    setOtpAttempts((prev) => prev + 1);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: values.email,
        otp: values.otp,
      });

      if (result?.error) {
        // Handle specific OTP error cases
        const errorMessage = result.error.toLowerCase();

        if (
          errorMessage.includes('invalid otp') ||
          errorMessage.includes('incorrect')
        ) {
          const remainingAttempts = Math.max(0, 3 - otpAttempts);
          toast.error('Incorrect OTP', {
            description:
              remainingAttempts > 0
                ? `The code you entered is incorrect. ${remainingAttempts} attempts remaining.`
                : 'The code you entered is incorrect. Please request a new code.',
          });

          // If too many attempts, suggest getting a new OTP
          if (otpAttempts >= 3) {
            toast.info('Too Many Attempts', {
              description:
                'Please request a new verification code and try again.',
            });
          }
        } else if (errorMessage.includes('expired')) {
          toast.error('OTP Expired', {
            description:
              'Your verification code has expired. Please request a new one.',
          });
          setOtpTimeout(0); // Reset timer to show expired state
        } else if (errorMessage.includes('no otp found')) {
          toast.error('No OTP Found', {
            description:
              'No verification code found for this email. Please request a new one.',
          });
        } else {
          toast.error('Verification Failed', {
            description: result.error,
          });
        }

        // Clear the OTP field for user to retry
        form.resetField('otp');
        form.setFocus('otp');
        throw new Error(result.error);
      } else {
        // Reset attempts on success
        setOtpAttempts(0);
        toast.success(action === 'login' ? 'Login Done' : 'Register Done', {
          description: `You have successfully ${
            action === 'login' ? 'logged in' : 'registered and logged in'
          }.`,
        });
        onSuccess();
      }
    } catch (error: unknown) {
      // Only show generic error if we haven't already shown a specific one
      if (
        error instanceof Error &&
        !error.message.includes('OTP') &&
        !error.message.includes('otp')
      ) {
        toast.error(`${action === 'login' ? 'Login' : 'Registration'} Failed`, {
          description: 'An unexpected error occurred. Please try again.',
        });
      }
    }
    setIsSubmitting(false);
  };

  const onResendOtp = async () => {
    setResendDisabled(true);
    setOtpAttempts(0); // Reset attempts when getting new OTP
    await requestOtp({ email: form.getValues('email') });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const onSubmit = step === 'email' ? requestOtp : onFinalSubmit;

  return (
    <div className='w-full'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          {step === 'email' && (
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='you@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {step === 'otp' && (
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
                  <span>
                    {otpTimeout > 0 ? formatTime(otpTimeout) : 'Expired'}
                  </span>
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
            </>
          )}

          {step === 'email' && (
            <Button type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className='animate-spin' /> : 'Continue'}
              {!isSubmitting && <ArrowRight className='ml-2' />}
            </Button>
          )}

          {step === 'otp' && (
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
                  (action === 'login'
                    ? 'Verify & Sign In'
                    : 'Verify & Register')}
              </Button>
              <Button
                variant='outline'
                className='w-full'
                onClick={() => {
                  setStep('email');
                  form.resetField('otp');
                }}
              >
                Back to email
              </Button>
            </div>
          )}
        </form>
      </Form>

      <div className='relative my-4'>
        <Separator />
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-background px-2 text-muted-foreground'>
            Or continue with
          </span>
        </div>
      </div>

      <Button
        variant='outline'
        className='w-full'
        onClick={handleGoogleSignIn}
        disabled={isGoogleSubmitting}
      >
        {isGoogleSubmitting ? (
          <Loader2 className='animate-spin' />
        ) : (
          <GoogleIcon className='mr-2 h-4 w-4' />
        )}
        {!isGoogleSubmitting && 'Google'}
      </Button>
    </div>
  );
}
