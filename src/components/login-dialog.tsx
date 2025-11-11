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
import { LogIn } from 'lucide-react';
import { AuthAction, AuthForm } from './auth-dialog-form';
import {
  useAuthDialogStore,
  AuthLoginRegisterAction,
} from '@/stores/authDialogStore';

export function LoginDialog() {
  const { isOpen, action, openDialog, closeDialog, setAction } =
    useAuthDialogStore();
  const isLoginDialog = action === AuthLoginRegisterAction.LOGIN;

  const handleSuccess = () => {
    closeDialog();
  };

  const handleSwitchToRegister = () => {
    setAction(AuthLoginRegisterAction.REGISTER);
  };

  return (
    <Dialog
      open={isOpen && isLoginDialog}
      onOpenChange={(open) => {
        if (open) {
          openDialog(AuthLoginRegisterAction.LOGIN);
        } else {
          closeDialog();
        }
      }}
    >
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
            Enter your email or Thai ID card to sign in, or continue with
            Google.
          </DialogDescription>
        </DialogHeader>
        <AuthForm action={AuthAction.LOGIN} onSuccess={handleSuccess} />

        <div className='relative my-4'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t border-muted' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>
              Don&apos;t have an account?
            </span>
          </div>
        </div>

        <Button
          variant='outline'
          onClick={handleSwitchToRegister}
          className='w-full'
        >
          Register
        </Button>
      </DialogContent>
    </Dialog>
  );
}
