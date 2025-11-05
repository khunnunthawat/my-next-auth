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
          Examples showing validation with Zod + FormField + FormControl and
          clear button feature
        </p>
        <p className='text-xs text-muted-foreground mt-1'>
          💡 The clear button (X icon) is enabled by default and appears only
          when focused and typing. Click outside to hide it.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          {/* Email Field with Validation (Clear button enabled by default) */}
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
                    onClear={() => {
                      // Clear the form field value
                      form.setValue('email', '');
                      console.log('Email cleared');
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Password Field with Validation (Clear button disabled for security) */}
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
                    showClearButton={false}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Username Field with Validation (Clear button enabled by default) */}
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
                    onClear={() => {
                      // Clear the form field value
                      form.setValue('username', '');
                      console.log('Username cleared');
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className='flex gap-3'>
            <Button type='submit' className='flex-1'>
              Submit
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={() => form.reset()}
              className='flex-1'
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>

      <div className='mt-10 space-y-6'>
        <div className='mb-6'>
          <h2 className='text-xl font-semibold text-foreground'>
            Standalone Examples
          </h2>
          <p className='text-sm text-muted-foreground mt-2'>
            FloatingInput without React Hook Form
          </p>
        </div>

        <FloatingInput
          label='Email (with default clear button)'
          helperText="Clear button is enabled by default - focus and type to see it"
          onClear={() => {
            console.log('Email cleared');
          }}
        />

        <FloatingInput
          label='Search'
          type='text'
          variant='primary'
          helperText='Clear button appears only when focused and typing'
          onClear={() => {
            console.log('Search cleared');
          }}
        />

        <FloatingInput
          label='Email with Error'
          helperText="We'll never share your email"
          error='Invalid email format' // Error shows, helper text hidden
        />

        <FloatingInput
          label='Password (clear button disabled)'
          variant='primary'
          type='password'
          helperText='Clear button disabled for security reasons'
          showClearButton={false}
        />

        <FloatingInput
          label='Username'
          type='text'
          helperText='Type to see the clear button'
        />
      </div>
    </div>
  );
}
