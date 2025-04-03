"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ResumeTemplateType } from "@/lib/resume-templates";
import { createCheckoutSession } from "@/services/payment-service";
import { useAuth } from "@/context/auth-context";
import { Lock, Unlock, Loader2, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthModal } from "./auth/auth-modal";
import { formatPrice, getTemplatePrice } from "@/lib/pricing";
import { checkTemplateAccess } from "@/services/template-service";

interface TemplateLockProps {
  templateId: ResumeTemplateType;
  templateName: string;
  onUnlocked?: () => void;
}

export function TemplateLock({ 
  templateId, 
  templateName, 
  onUnlocked 
}: TemplateLockProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLocked, setIsLocked] = useState(true);
  const [price, setPrice] = useState<number | null>(getTemplatePrice(templateId));
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Check if the template is locked for this user
    async function checkAccess() {
      setIsLoading(true);
      try {
        const access = await checkTemplateAccess(templateId);
        setIsLocked(!access.hasPurchased);
        setPrice(access.price);
      } catch (error) {
        console.error("Error checking template access:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkAccess();
  }, [templateId, user]);

  const handlePurchase = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsPurchasing(true);
    try {
      // Create checkout session with LemonSqueezy
      const session = await createCheckoutSession(
        templateId,
        `${window.location.origin}/templates/success`
      );
      
      // Redirect to LemonSqueezy checkout page
      if (session.url) {
        window.location.href = session.url;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Failed to start checkout process. Please try again.");
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleUnlock = () => {
    if (onUnlocked) {
      onUnlocked();
    }
  };

  // If template is not locked or still checking, don't show anything
  if (!isLocked) {
    return null;
  }

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] rounded-md flex items-center justify-center z-10">
      {isLoading ? (
        <div className="text-white flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin mb-2" />
          <span>Checking access...</span>
        </div>
      ) : (
        <Card className="w-11/12 max-w-sm p-4 bg-white shadow-xl">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="rounded-full bg-yellow-100 p-3">
              <Lock className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-bold">Premium Template</h3>
            <p className="text-muted-foreground text-sm">
              Unlock the <span className="font-medium">{templateName}</span> template with a one-time purchase.
            </p>
            
            <div className="text-2xl font-bold text-blue-600 my-2">
              {formatPrice(price)}
            </div>
            
            <Button
              onClick={handlePurchase}
              disabled={isPurchasing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isPurchasing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" /> Unlock This Template
                </>
              )}
            </Button>
            
            <div className="flex items-center justify-center pt-2">
              <img 
                src="/images/powered-by-lemonsqueezy.svg" 
                alt="Powered by LemonSqueezy" 
                className="h-5" 
              />
            </div>
            
            <p className="text-xs text-muted-foreground">
              Secure payment. Purchase once, use forever.
            </p>
          </div>
        </Card>
      )}
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="login"
        onSuccess={() => {
          setShowAuthModal(false);
          handlePurchase();
        }}
      />
    </div>
  );
}