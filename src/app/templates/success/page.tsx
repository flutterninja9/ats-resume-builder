"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { verifyPurchase } from "@/services/payment-service";
import { CheckCircle, XCircle, Loader2, Home } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function PurchaseSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  
  // Get parameters from URL
  // LemonSqueezy will send order_id in the URL when the user completes payment
  const orderId = searchParams.get('order_id');
  const templateId = searchParams.get('template_id');

  useEffect(() => {
    async function verifyOrder() {
      if (!orderId) {
        setIsVerifying(false);
        setIsSuccess(false);
        setError("No order ID provided");
        return;
      }

      try {
        const { success, error } = await verifyPurchase(orderId);
        setIsSuccess(success);
        if (error) setError(error);
      } catch (err) {
        console.error("Error verifying purchase:", err);
        setIsSuccess(false);
        setError("Failed to verify purchase");
      } finally {
        setIsVerifying(false);
      }
    }

    if (orderId) {
      verifyOrder();
    } else {
      setIsVerifying(false);
      setIsSuccess(false);
      setError("Invalid payment information");
    }
  }, [orderId]);

  return (
    <main className="container max-w-4xl mx-auto px-4 py-16 flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isVerifying ? "Verifying Purchase" : isSuccess ? "Purchase Successful!" : "Purchase Failed"}
          </CardTitle>
          <CardDescription>
            {isVerifying 
              ? "Please wait while we verify your purchase..." 
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
            
            {!isSuccess && !isVerifying && (
              <p className="text-muted-foreground">
                If your payment was successful but shows as failed here, please contact support with your order ID: <span className="font-mono bg-muted px-1 py-0.5 rounded text-sm">{orderId || 'N/A'}</span>
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