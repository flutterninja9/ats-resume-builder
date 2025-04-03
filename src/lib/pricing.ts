import { ResumeTemplateType } from './resume-templates';

// Define pricing constants
export const FREE_TEMPLATE_ID: ResumeTemplateType = 'classic';
export const TEMPLATE_PRICE = 1.00; // $1 per template

export interface TemplateAccess {
  hasPurchased: boolean;
  price: number | null; // null means free
}

// Function to check if a template is free
export function isTemplateFreeTier(templateId: ResumeTemplateType): boolean {
  return templateId === FREE_TEMPLATE_ID;
}

// Function to get the price for a template (returns null if free)
export function getTemplatePrice(templateId: ResumeTemplateType): number | null {
  return isTemplateFreeTier(templateId) ? null : TEMPLATE_PRICE;
}

// Format price for display
export function formatPrice(price: number | null): string {
  if (price === null) return 'Free';
  return `$${price.toFixed(2)}`;
}

// --- Database Types ---

// Type for the database table holding user template purchases
export interface UserTemplatePurchase {
  id: string;
  user_id: string;
  template_id: string;
  purchased_at: string;
  amount_paid: number;
  transaction_id: string;
}

// --- Stripe Related Types ---
export interface StripeCheckoutSession {
  id: string;
  url: string;
}

// --- New tables for Supabase ---
/*
CREATE TABLE template_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  template_id TEXT NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  amount_paid DECIMAL(10, 2) NOT NULL,
  transaction_id TEXT NOT NULL,
  
  CONSTRAINT unique_user_template UNIQUE(user_id, template_id)
);

-- Add RLS policies
ALTER TABLE template_purchases ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read their own purchases
CREATE POLICY "Users can view their own template purchases" 
ON template_purchases FOR SELECT 
USING (auth.uid() = user_id);

-- Policy to allow stripe webhook to insert purchases
CREATE POLICY "API can insert purchases" 
ON template_purchases FOR INSERT 
TO authenticated
USING (true);
*/