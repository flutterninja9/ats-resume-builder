'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import { checkPremiumStatus } from '@/services/resume-service';
import { Loader2, Save, ShieldCheck, User as UserIcon, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BillingSection } from './billing_section';

export default function Profile() {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if not authenticated
    if (!authLoading && !user) {
      router.push('/');
      return;
    }

    // Load user profile data
    if (user) {
      loadProfileData();
      checkSubscriptionStatus();
    }
  }, [user, authLoading, router]);

  const loadProfileData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setFullName(data?.full_name || '');
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Could not load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      const { isPremium, error } = await checkPremiumStatus();
      if (!error) {
        setIsPremium(isPremium);
      }
    } catch (err) {
      console.error('Error checking subscription:', err);
    }
  };

  const handleUpdateProfile = async () => {
    setIsSaving(true);
    setSuccessMessage(null);
    setError(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user?.id);

      if (error) throw error;
      setSuccessMessage('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handlePasswordReset = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user?.email || '', {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      setSuccessMessage('Password reset email sent. Please check your inbox.');
    } catch (err) {
      console.error('Error sending reset password email:', err);
      setError('Failed to send password reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500" />
          <h2 className="mt-4 text-xl font-semibold">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <main className="container max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Account</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-blue-500" /> Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {successMessage && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}
              
              {error && (
                <Alert className="bg-red-50 text-red-800 border-red-200">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user.email || ''}
                  disabled
                  className="bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">
                  Your email cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t pt-5">
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
              <Button 
                onClick={handleUpdateProfile} 
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-blue-500" /> Subscription Status
              </CardTitle>
              <CardDescription>
                Manage your subscription and billing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-md bg-muted/20">
                <div>
                  <h3 className="font-medium mb-1">Current Plan</h3>
                  <div className="flex items-center">
                    <Badge variant={isPremium ? "default" : "outline"}>
                      {isPremium ? "Premium" : "Free"}
                    </Badge>
                    {isPremium && (
                      <span className="ml-3 text-sm text-muted-foreground">
                        Your premium benefits are active
                      </span>
                    )}
                  </div>
                </div>
                {!isPremium && (
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white">
                    Upgrade to Premium
                  </Button>
                )}
              </div>

              <div className="pt-2">
                <h3 className="font-medium mb-3">Premium Benefits</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <ShieldCheck className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Access to all premium resume templates</span>
                  </li>
                  <li className="flex items-start">
                    <ShieldCheck className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>AI-powered resume scoring and optimization</span>
                  </li>
                  <li className="flex items-start">
                    <ShieldCheck className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Unlimited resume storage and downloads</span>
                  </li>
                  <li className="flex items-start">
                    <ShieldCheck className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Priority support and expert resume review</span>
                  </li>
                </ul>
              </div>
            <BillingSection />
            </CardContent>
            <CardFooter className="justify-between border-t pt-5">
              <div className="text-sm text-muted-foreground">
                Questions about billing? <a href="#" className="text-blue-600 hover:underline">Contact support</a>
              </div>
              {isPremium && (
                <Button variant="outline">
                  Manage Subscription
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-blue-500" /> Security
              </CardTitle>
              <CardDescription>
                Manage your password and account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-medium">Change Password</h3>
                <p className="text-sm text-muted-foreground">
                  To change your password, we&#39;ll send a password reset link to your email address.
                </p>
                <Button 
                  variant="outline" 
                  onClick={handlePasswordReset}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    'Send Password Reset Link'
                  )}
                </Button>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="font-medium text-destructive">Danger Zone</h3>
                <div className="border border-destructive/20 rounded-md p-4">
                  <h4 className="font-medium mb-2">Sign Out of All Devices</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    This will sign you out of all devices where you&#39;re currently logged in.
                  </p>
                  <Button variant="outline" className="text-destructive border-destructive/50">
                    Sign Out Everywhere
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t pt-5">
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Back to Dashboard
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}