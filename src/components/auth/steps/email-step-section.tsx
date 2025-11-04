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
import { AuthFormValues } from '../types';

export interface EmailStepSectionProps {
  form: UseFormReturn<AuthFormValues>;
  isSubmitting: boolean;
}

export function EmailStepSection({ form, isSubmitting }: EmailStepSectionProps) {
  return (
    <>
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
      <Button type='submit' className='w-full' disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className='animate-spin' /> : 'Continue'}
        {!isSubmitting && <ArrowRight className='ml-2' />}
      </Button>
    </>
  );
}
