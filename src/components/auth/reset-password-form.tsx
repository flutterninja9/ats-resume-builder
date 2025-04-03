import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { useState } from 'react';

interface ResetPasswordFormProps {
  onBack: () => void;
}

export function ResetPasswordForm({ onBack }: ResetPasswordFormProps) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { error } = await resetPassword(email);
      if (error) {
        setError(error.message);
      } else {
        setSuccessMessage('Check your email for the password reset link!');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="reset-email" className="flex items-center">
          <Mail className="h-4 w-4 mr-2 text-muted-foreground" /> Email
        </Label>
        <Input
          id="reset-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          We&#39;ll send you a link to reset your password
        </p>
      </div>
      
      {error && (
        <div className="text-destructive text-sm">{error}</div>
      )}
      
      {successMessage && (
        <div className="text-green-600 text-sm">{successMessage}</div>
      )}
      
      <div className="flex justify-between pt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Login
        </Button>
        
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending
            </>
          ) : (
            'Reset Password'
          )}
        </Button>
      </div>
    </form>
  );
}