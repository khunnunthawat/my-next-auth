'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { AuthForm } from './auth-dialog-form';

export function LoginDialog() {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size='lg'
          className='shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow w-full'
        >
          <LogIn className='mr-2 h-5 w-5' /> Login
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Enter your email to sign in or continue with Google.
          </DialogDescription>
        </DialogHeader>
        <AuthForm action='login' onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
