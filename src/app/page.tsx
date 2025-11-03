'use client';

import { useSession, signOut } from 'next-auth/react';
import { LoginDialog } from '@/components/login-dialog';
import { RegisterDialog } from '@/components/register-dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LogOut, Shield, Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-background px-4 py-12'>
      <main className='w-full max-w-2xl space-y-8'>
        {/* Header */}
        <div className='text-center space-y-4'>
          <div className='flex justify-center mb-4'>
            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary'>
              <Shield className='h-8 w-8' />
            </div>
          </div>
          <h1 className='text-xl lg:text-4xl font-bold tracking-tight text-foreground'>
            Secure Auth Portal
          </h1>
          <p className='text-sm lg:text-lg text-muted-foreground max-w-md mx-auto'>
            Modern authentication with Email/OTP and Google OAuth
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className='flex items-center justify-center py-12'>
              <div className='animate-pulse text-muted-foreground'>
                Loading session...
              </div>
            </CardContent>
          </Card>
        )}

        {/* Authenticated State */}
        {!isLoading && session && (
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <CheckCircle2 className='h-5 w-5 text-primary' />
                Welcome Back!
              </CardTitle>
              <CardDescription>
                You are successfully authenticated
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-4'>
                <div className='flex items-start gap-3 p-4 rounded-lg bg-muted'>
                  <Mail className='h-5 w-5 text-muted-foreground mt-0.5' />
                  <div className='space-y-1'>
                    <p className='text-sm font-medium text-foreground'>Email</p>
                    <p className='text-sm text-muted-foreground'>
                      {session.user?.email || 'Not available'}
                    </p>
                  </div>
                </div>

                {session.user?.name && (
                  <div className='flex items-start gap-3 p-4 rounded-lg bg-muted'>
                    <Shield className='h-5 w-5 text-muted-foreground mt-0.5' />
                    <div className='space-y-1'>
                      <p className='text-sm font-medium text-foreground'>
                        Name
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        {session.user.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={handleLogout}
                variant='outline'
                className='w-full'
                size='lg'
              >
                <LogOut className='mr-2 h-5 w-5' />
                Logout
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Unauthenticated State */}
        {!isLoading && !session && (
          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex flex-col sm:flex-row gap-4'>
                <div className='flex-1'>
                  <LoginDialog />
                </div>
                <div className='flex-1'>
                  <RegisterDialog />
                </div>
              </div>

              <div className='rounded-lg border border-border bg-muted/30 p-4'>
                <p className='text-xs text-muted-foreground text-center'>
                  <span className='font-medium'>Demo OTP:</span> Use{' '}
                  <code className='bg-background px-2 py-0.5 rounded text-primary font-mono'>
                    123456
                  </code>{' '}
                  (expires in 5 minutes)
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4'>
          <div className='p-4 rounded-lg border border-border bg-card'>
            <h3 className='font-semibold text-sm text-foreground mb-1'>
              Email + OTP
            </h3>
            <p className='text-xs text-muted-foreground'>
              Secure passwordless authentication with time-limited codes
            </p>
          </div>
          <div className='p-4 rounded-lg border border-border bg-card'>
            <h3 className='font-semibold text-sm text-foreground mb-1'>
              Google OAuth
            </h3>
            <p className='text-xs text-muted-foreground'>
              Quick and seamless sign-in with your Google account
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
