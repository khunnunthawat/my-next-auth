'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FloatingInput } from '@/components/ui/floating-input';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

// Define validation schema
const formSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters'),
});

type FormValues = z.infer<typeof formSchema>;

export default function InputPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      username: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
    // Handle form submission here
  };

  return (
    <div className='container my-10 mx-auto max-w-md'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-foreground'>
          FloatingInput with React Hook Form
        </h1>
        <p className='text-sm text-muted-foreground mt-2'>
          Example showing email validation with Zod + FormField + FormControl
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {/* Email Field with Validation */}
          <FormField
            control={form.control}
            name='email'
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <FloatingInput
                    {...field}
                    label='Email address'
                    type='email'
                    error={fieldState.error?.message}
                    variant='primary'
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Password Field with Validation */}
          <FormField
            control={form.control}
            name='password'
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <FloatingInput
                    {...field}
                    label='Password'
                    type='password'
                    error={fieldState.error?.message}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Username Field with Validation */}
          <FormField
            control={form.control}
            name='username'
            render={({ field, fieldState }) => (
              <FormItem>
                <FormControl>
                  <FloatingInput
                    {...field}
                    label='Username'
                    type='text'
                    error={fieldState.error?.message}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type='submit' className='w-full'>
            Submit
          </Button>
        </form>
      </Form>

      <div className='mt-10 space-y-6'>
        <FloatingInput
          label='Email'
          helperText="We'll never share your email"
        />

        <FloatingInput
          label='Email'
          helperText="We'll never share your email"
          error='Invalid email format' // Error shows, helper text hidden
        />

        <FloatingInput
          label='Password'
          variant='primary'
          helperText='Must be at least 8 characters'
        />
      </div>
    </div>
  );
}
