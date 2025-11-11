'use client';

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
import {
  useAuthDialogStore,
  AuthLoginRegisterAction,
} from '@/stores/authDialogStore';

export function RegisterDialog() {
  const { isOpen, action, openDialog, closeDialog, setAction } =
    useAuthDialogStore();
  const isRegisterDialog = action === AuthLoginRegisterAction.REGISTER;

  const handleSuccess = () => {
    closeDialog();
  };

  const handleSwitchToLogin = () => {
    setAction(AuthLoginRegisterAction.LOGIN);
  };

  return (
    <Dialog
      open={isOpen && isRegisterDialog}
      onOpenChange={(open) => {
        if (open) {
          openDialog(AuthLoginRegisterAction.REGISTER);
        } else {
          closeDialog();
        }
      }}
    >
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
            Enter your email address to create an account, or continue with
            Google.
          </DialogDescription>
        </DialogHeader>
        <AuthForm action={AuthAction.REGISTER} onSuccess={handleSuccess} />

        <div className='relative my-4'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t border-muted' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>
              Already have an account?
            </span>
          </div>
        </div>

        <Button
          variant='outline'
          onClick={handleSwitchToLogin}
          className='w-full'
        >
          Login
        </Button>
      </DialogContent>
    </Dialog>
  );
}
