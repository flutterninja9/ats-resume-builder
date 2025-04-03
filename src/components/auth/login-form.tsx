import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/auth-context';
import { Loader2, Lock, Mail } from 'lucide-react';
import { useState } from 'react';

interface LoginFormProps {
  onForgotPassword: () => void;
  onSuccess?: () => void;
}

export function LoginForm({ onForgotPassword, onSuccess }: LoginFormProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else if (onSuccess) {
        onSuccess();
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
        <Label htmlFor="email" className="flex items-center">
          <Mail className="h-4 w-4 mr-2 text-muted-foreground" /> Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password" className="flex items-center">
          <Lock className="h-4 w-4 mr-2 text-muted-foreground" /> Password
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
          required
        />
      </div>
      
      {error && (
        <div className="text-destructive text-sm">{error}</div>
      )}
      
      <div className="flex justify-between pt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onForgotPassword}
        >
          Forgot Password?
        </Button>
        
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </div>
    </form>
  );
}
