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
import { UserPlus } from 'lucide-react';
import { AuthAction, AuthForm } from './auth-dialog-form';

export function RegisterDialog() {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant='secondary'
          size='lg'
          className='shadow-lg shadow-secondary/20 hover:shadow-secondary/30 transition-shadow w-full'
        >
          <UserPlus className='mr-2 h-5 w-5' /> Register
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Register</DialogTitle>
          <DialogDescription>
            Create an account to get started.
          </DialogDescription>
        </DialogHeader>
        <AuthForm action={AuthAction.REGISTER} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
