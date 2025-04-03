import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { LoginForm } from './login-form';
import { ResetPasswordForm } from './reset-password-form';
import { SignupForm } from './signup-form';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup' | 'reset-password';
  onSuccess?: () => void;
}

export function AuthModal({ 
  isOpen, 
  onClose, 
  defaultTab = 'login',
  onSuccess 
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'reset-password'>(defaultTab);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {activeTab === 'login' && 'Sign In to Download'}
            {activeTab === 'signup' && 'Create Account'}
            {activeTab === 'reset-password' && 'Reset Password'}
          </DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as never)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm 
              onForgotPassword={() => setActiveTab('reset-password')} 
              onSuccess={onSuccess}
            />
          </TabsContent>
          <TabsContent value="signup">
            <SignupForm onSuccess={onSuccess} />
          </TabsContent>
          <TabsContent value="reset-password">
            <ResetPasswordForm onBack={() => setActiveTab('login')} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}