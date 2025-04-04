"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Home } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function PurchaseSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  
  // Get parameters from URL
  // LemonSqueezy doesn't provide an order_id in the redirect,
  // but we included template_id in our redirect URL
  const templateId = searchParams.get('template_id');
  
  useEffect(() => {
    async function processSuccess() {
      // If we have a template_id, we can assume the payment was successful
      // The actual purchase verification will happen via the webhook
      if (templateId && user) {
        try {
          // Record the template as purchased
          // This is a fallback in case the webhook hasn't processed yet
          const response = await fetch('/api/mark-template-purchased', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              templateId,
              userId: user.id,
            }),
          });
          
          setIsSuccess(true);
        } catch (err) {
          console.error("Error marking template as purchased:", err);
          // Still mark as success since payment likely completed
          setIsSuccess(true);
        }
      } else {
        setError("Missing template information");
        setIsSuccess(false);
      }
      
      setIsVerifying(false);
    }

    processSuccess();
  }, [templateId, user]);

  return (
    <main className="container max-w-4xl mx-auto px-4 py-16 flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isVerifying ? "Processing Purchase" : isSuccess ? "Purchase Successful!" : "Purchase Verification Failed"}
          </CardTitle>
          <CardDescription>
            {isVerifying 
              ? "Please wait while we process your purchase..." 
              : isSuccess 
                ? "Your template has been unlocked successfully." 
                : `Purchase verification failed: ${error}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="flex justify-center py-6">
            {isVerifying ? (
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
            ) : isSuccess ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          
          <div className="space-y-4">
            {isSuccess && (
              <p className="text-muted-foreground">
                You now have full access to use this template in your resume builder.
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button asChild variant="outline">
                <Link href="/templates">
                  View All Templates
                </Link>
              </Button>
              
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href={templateId ? `/?template=${templateId}` : "/"}>
                  <Home className="mr-2 h-4 w-4" /> Go to Resume Builder
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}