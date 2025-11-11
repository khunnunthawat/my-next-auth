'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn, useSession } from 'next-auth/react';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import {
  AuthAction,
  AuthStep,
  AuthFormValues,
  emailOrThaiIdSchema,
  emailOnlySchema,
  otpSchema,
  OTP_MESSAGES,
  EmailStepSection,
  OtpStepSection,
  GoogleSignInSection,
} from './auth';

interface AuthFormProps {
  action: AuthAction;
  onSuccess: () => void;
}

export function AuthForm({ action, onSuccess }: AuthFormProps) {
  const [step, setStep] = useState<AuthStep>(AuthStep.EMAIL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [otpTimeout, setOtpTimeout] = useState(0);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [userMessage, setUserMessage] = useState<string>('');
  const [refCode, setRefCode] = useState<string>('');
  const [actualAction, setActualAction] = useState<AuthAction>(action);
  const { data: session } = useSession();

  // Combined schema for both steps - OTP validation happens manually in onFinalSubmit
  // Use emailOnlySchema for REGISTER, emailOrThaiIdSchema for LOGIN
  const baseSchema =
    action === AuthAction.REGISTER ? emailOnlySchema : emailOrThaiIdSchema;
  const combinedSchema = baseSchema.extend({
    otp: z.string(),
  });

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(combinedSchema),
    defaultValues: { email: '', otp: '' },
    mode: 'onChange',
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpTimeout > 0) {
      timer = setTimeout(() => setOtpTimeout(otpTimeout - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpTimeout]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      setResendDisabled(true);
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_MIRROR_SESSION_TO_STORAGE === 'true' &&
      session?.accessToken
    ) {
      sessionStorage.setItem('session.accessToken', session.accessToken);
    }
  }, [session]);

  const startOtpTimer = () => {
    setOtpTimeout(100); // 5 minutes (300 seconds)
    setResendCountdown(60); // 60 seconds Countdown before resend is enabled
  };

  // const handleGoogleSignIn = async () => {
  //   setIsGoogleSubmitting(true);
  //   await signIn('google', { callbackUrl: '/' });
  //   setIsGoogleSubmitting(false);
  // };

  const requestOtp = async (values: Pick<AuthFormValues, 'email'>) => {
    setIsSubmitting(true);
    try {
      // Use different API endpoints based on action
      const apiEndpoint =
        action === AuthAction.REGISTER
          ? '/api/auth/register-new-email'
          : '/api/auth/check-existing-email';

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await response.json();

      // Handle registration case
      if (action === AuthAction.REGISTER) {
        if (!response.ok) {
          throw new Error(data.error || 'Failed to send OTP');
        }

        if (data.success) {
          // Set the actual action based on whether user exists
          // If user exists, we'll login instead of register
          setActualAction(data.exists ? AuthAction.LOGIN : AuthAction.REGISTER);
          setUserMessage(
            data.userMessage ||
              (data.isNew
                ? 'Create account my-next-auth.'
                : 'This email already has an account with my-next-auth.')
          );
          setRefCode(data.refCode || '');

          toast.info('OTP Sent (Demo)', {
            description: `An OTP has been sent to ${values.email}. Use '123456'.`,
          });
          setStep(AuthStep.OTP);
          startOtpTimer();
        }
      }
      // Handle login case
      else {
        if (!data.success) {
          throw new Error(data.error || 'Failed to send OTP');
        }

        if (data.exists) {
          // Email exists, proceed to OTP for login
          setActualAction(AuthAction.LOGIN);
          setUserMessage(
            data.userMessage ||
              'This email already has an account with my-next-auth.'
          );
          setRefCode(data.refCode || '');
          toast.info('OTP Sent (Demo)', {
            description: `An OTP has been sent to ${values.email}. Use '123456'.`,
          });
          setStep(AuthStep.OTP);
          startOtpTimer();
        } else {
          // Email doesn't exist during login
          toast.error('Email Not Found', {
            description: 'This email is not registered. Please register first.',
          });
        }
      }
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
    console.log('[Auth] onFinalSubmit called with values:', values);

    // Validate OTP is provided and is 6 characters
    if (!values.otp || values.otp.length !== 6) {
      console.log('[Auth] OTP validation failed:', values.otp);
      form.setError('otp', {
        type: 'manual',
        message: OTP_MESSAGES.REQUIRED,
      });
      return;
    }

    console.log('[Auth] Starting signIn with credentials');
    setIsSubmitting(true);
    setOtpAttempts((prev) => prev + 1);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: values.email,
        otp: values.otp,
      });

      console.log('[Auth] signIn result:', result);

      if (result?.error) {
        // Handle specific OTP error cases
        const errorMessage = result.error.toLowerCase();

        if (
          errorMessage.includes('invalid otp') ||
          errorMessage.includes('incorrect')
        ) {
          const remainingAttempts = Math.max(0, 3 - otpAttempts);
          toast.error(OTP_MESSAGES.INVALID, {
            description:
              remainingAttempts > 0
                ? `${remainingAttempts} attempts remaining.`
                : 'Please request a new code.',
          });

          // If too many attempts, suggest getting a new OTP
          if (otpAttempts >= 3) {
            toast.info('Too Many Attempts', {
              description:
                'Please request a new verification code and try again.',
            });
          }
        } else if (errorMessage.includes('expired')) {
          toast.error(OTP_MESSAGES.EXPIRED, {
            description: 'Please request a new one.',
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
        toast.success(
          actualAction === AuthAction.LOGIN ? 'Login Done' : 'Register Done',
          {
            description: `You have successfully ${
              actualAction === AuthAction.LOGIN
                ? 'logged in'
                : 'registered and logged in'
            }.`,
          }
        );
        onSuccess();
      }
    } catch (error: unknown) {
      // Only show generic error if we haven't already shown a specific one
      if (
        error instanceof Error &&
        !error.message.includes('OTP') &&
        !error.message.includes('otp')
      ) {
        toast.error(
          `${
            actualAction === AuthAction.LOGIN ? 'Login' : 'Registration'
          } Failed`,
          {
            description: 'An unexpected error occurred. Please try again.',
          }
        );
      }
    }
    setIsSubmitting(false);
  };

  const onResendOtp = async () => {
    setResendDisabled(true);
    setOtpAttempts(0); // Reset attempts when getting new OTP
    await requestOtp({ email: form.getValues('email') });
  };

  const handleBackToEmail = () => {
    setStep(AuthStep.EMAIL);
    form.resetField('otp');
  };

  const onSubmit = step === AuthStep.EMAIL ? requestOtp : onFinalSubmit;

  return (
    <div className='w-full'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          {step === AuthStep.EMAIL && (
            <EmailStepSection
              form={form}
              isSubmitting={isSubmitting}
              action={action}
            />
          )}

          {step === AuthStep.OTP && (
            <OtpStepSection
              form={form}
              action={actualAction}
              isSubmitting={isSubmitting}
              otpTimeout={otpTimeout}
              resendCountdown={resendCountdown}
              resendDisabled={resendDisabled}
              onResendOtp={onResendOtp}
              onBackToEmail={handleBackToEmail}
              userMessage={userMessage}
              refCode={refCode}
            />
          )}
        </form>
      </Form>

      <GoogleSignInSection
      // isGoogleSubmitting={isGoogleSubmitting}
      // onGoogleSignIn={handleGoogleSignIn}
      />
    </div>
  );
}

// Re-export types for backward compatibility
export { AuthAction, AuthStep } from './auth/types';
export type { AuthFormValues } from './auth/types';
