'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const floatingInputVariants = cva(
  'relative overflow-hidden rounded-md transition-all duration-200',
  {
    variants: {
      variant: {
        default: [
          // Base background - matches shadcn Input
          'bg-transparent dark:bg-input/30',
          // Border - full border like shadcn Input
          'border border-input shadow-xs',
        ],
        primary: [
          // Primary theme background
          'bg-gray-800',
          // Border with subtle styling
          'border border-gray-700 shadow-xs',
        ],
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface FloatingInputProps
  extends Omit<React.ComponentProps<'input'>, 'placeholder'>,
    VariantProps<typeof floatingInputVariants> {
  label: string;
  error?: string;
  helperText?: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, type, label, error, helperText, variant, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Generate a stable ID if one isn't provided
    const generatedId = React.useId();
    const inputId = props.id || generatedId;

    // Combine refs
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // Check if input has value - also check on mount and when props change
    React.useEffect(() => {
      if (inputRef.current) {
        const currentValue = inputRef.current.value;
        setHasValue(!!currentValue && currentValue.length > 0);
      }
    }, [props.value, props.defaultValue]);

    const isFloating = isFocused || hasValue;

    return (
      <div className='relative w-full'>
        <div
          className={cn(
            floatingInputVariants({ variant }),
            // Focus state - ring effect like shadcn Input
            isFocused &&
              !error &&
              'border-ring ring-ring/50 ring-[3px] outline-none',
            // Error state
            error &&
              'border-destructive ring-destructive/20 dark:ring-destructive/40 ring-[3px]',
            // Disabled state
            props.disabled &&
              'opacity-50 cursor-not-allowed pointer-events-none'
          )}
        >
          {/* Floating Label */}
          <label
            htmlFor={inputId}
            className={cn(
              'absolute left-3 pointer-events-none transition-all duration-200 ease-out',
              'text-muted-foreground',
              isFloating
                ? 'top-1.5 text-xs font-medium'
                : 'top-1/2 -translate-y-1/2 text-sm md:text-sm',
              isFocused && !error && 'text-ring',
              error && 'text-destructive'
            )}
          >
            {label}
          </label>

          {/* Input */}
          <input
            {...props}
            ref={inputRef}
            id={inputId}
            type={type}
            data-slot='input'
            className={cn(
              'w-full bg-transparent px-3 pb-2 outline-none transition-[color,box-shadow]',
              'text-base md:text-sm text-foreground',
              'selection:bg-primary selection:text-primary-foreground',
              'disabled:cursor-not-allowed disabled:pointer-events-none',
              // Add padding top when label is floating
              isFloating ? 'pt-5' : 'pt-6',
              className
            )}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              // Ensure we check the actual current value from the input element
              const currentValue = e.target.value;
              setHasValue(!!currentValue && currentValue.length > 0);
              props.onBlur?.(e);
            }}
            onChange={(e) => {
              const currentValue = e.target.value;
              setHasValue(!!currentValue && currentValue.length > 0);
              props.onChange?.(e);
            }}
            aria-invalid={!!error}
          />
        </div>

        {/* Error message */}
        {error && (
          <p className='mt-1.5 text-xs text-destructive font-medium px-0.5'>
            {error}
          </p>
        )}

        {/* Helper text - only show when no error */}
        {!error && helperText && (
          <p className='mt-1.5 text-xs text-muted-foreground px-0.5'>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';

export { FloatingInput };
