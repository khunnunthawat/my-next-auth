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
import { Input } from '@/components/ui/input';
import { ArrowRight, Loader2 } from 'lucide-react';
import { AuthFormValues, AuthAction } from '../types';

export interface EmailStepSectionProps {
  form: UseFormReturn<AuthFormValues>;
  isSubmitting: boolean;
  action: AuthAction;
}

export function EmailStepSection({ form, isSubmitting, action }: EmailStepSectionProps) {
  const isRegister = action === AuthAction.REGISTER;

  return (
    <>
      <FormField
        control={form.control}
        name='email'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {isRegister ? 'Email' : 'Email or Thai ID Card'}
            </FormLabel>
            <FormControl>
              <Input
                placeholder={
                  isRegister
                    ? 'you@example.com'
                    : 'you@example.com or 1234567890123'
                }
                {...field}
              />
            </FormControl>
            <FormMessage />
            <p className='text-xs text-muted-foreground mt-1.5'>
              {isRegister
                ? 'Enter your email address to create an account'
                : 'Enter your email address or 13-digit Thai ID card number'}
            </p>
          </FormItem>
        )}
      />
      <Button type='submit' className='w-full' disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className='animate-spin' /> : 'Continue'}
        {!isSubmitting && <ArrowRight className='ml-2' />}
      </Button>
    </>
  );
}
