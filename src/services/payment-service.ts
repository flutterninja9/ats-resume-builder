import { TEMPLATE_PRICE } from '@/lib/pricing';
import { ResumeTemplateType, resumeTemplates } from '@/lib/resume-templates';
import { supabase } from '@/lib/supabase';

// Define the LemonSqueezy checkout response type
export interface LemonSqueezyCheckout {
  url: string;
  checkoutId: string;
}

// Create a checkout session for template purchase
export async function createCheckoutSession(
  templateId: ResumeTemplateType,
  templateName: string,
  userData: { id: string, email: string },
  returnUrl: string
): Promise<LemonSqueezyCheckout> {
  const response = await fetch('/api/checkout/create-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      templateId,
      templateName,
      userData, // Pass user data directly
      returnUrl,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create checkout session: ${error}`);
  }
  
  return response.json();
}

// Verify a purchase was successful
export async function verifyPurchase(
  orderId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const response = await fetch(`/api/checkout/verify-order?order_id=${orderId}&user_id=${userId}`);
  
  if (!response.ok) {
    const error = await response.text();
    return { success: false, error };
  }
  
  return response.json();
}