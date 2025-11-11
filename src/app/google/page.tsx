'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { Spinner } from '../../components/ui/spinner';

function GoogleContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  useEffect(() => {
    // Automatically trigger sign in when page loads
    signIn('google', { callbackUrl });
  }, [callbackUrl]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <div className='text-center'>
        <Spinner className='mx-auto size-12 mb-4' />
        <p className='text-gray-600'>Redirecting to Google...</p>
      </div>
    </div>
  );
}

export default function GooglePage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-background'>
          <div className='text-center'>
            <Spinner className='mx-auto size-12 mb-4' />
            <p className='text-gray-600'>Loading...</p>
          </div>
        </div>
      }
    >
      <GoogleContent />
    </Suspense>
  );
}
