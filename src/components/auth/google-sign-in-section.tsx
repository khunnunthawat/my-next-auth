'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { GoogleIcon } from '@/components/icons/google-icon';
import { useOAuthPopup } from '../../hooks/useOAuthPopup';

// export interface GoogleSignInSectionProps {
//   isGoogleSubmitting: boolean;
//   onGoogleSignIn: () => void;
// }

export function GoogleSignInSection() {
  const { openOAuthPopup, isLoading } = useOAuthPopup();

  const onGoogleSignIn = () => {
    openOAuthPopup();
  };

  return (
    <>
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
        onClick={onGoogleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className='animate-spin' />
        ) : (
          <GoogleIcon className='mr-2 h-4 w-4' />
        )}
        {!isLoading && 'Google'}
      </Button>
    </>
  );
}
