import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { Loader2, Lock, Mail, UserPlus } from 'lucide-react';
import { useState } from 'react';

interface SignupFormProps {
  onSuccess?: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error.message);
      } else {
        setSuccessMessage('Check your email for the confirmation link!');
        if (onSuccess) {
          onSuccess();
        }
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
        <Label htmlFor="signup-email" className="flex items-center">
          <Mail className="h-4 w-4 mr-2 text-muted-foreground" /> Email
        </Label>
        <Input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-password" className="flex items-center">
          <Lock className="h-4 w-4 mr-2 text-muted-foreground" /> Password
        </Label>
        <Input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          required
          minLength={6}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Password must be at least 6 characters
        </p>
      </div>
      
      {error && (
        <div className="text-destructive text-sm">{error}</div>
      )}
      
      {successMessage && (
        <div className="text-green-600 text-sm">{successMessage}</div>
      )}
      
      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" /> Create Account
            </>
          )}
        </Button>
      </div>
    </form>
  );
}