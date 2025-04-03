import { supabase } from '@/lib/supabase';
import { FREE_TEMPLATE_ID, TemplateAccess } from '@/lib/pricing';
import { ResumeTemplateType } from '@/lib/resume-templates';

// Check if user has access to a template
export async function checkTemplateAccess(templateId: ResumeTemplateType): Promise<TemplateAccess> {
  // Free template is always accessible
  if (templateId === FREE_TEMPLATE_ID) {
    return { hasPurchased: true, price: null };
  }
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return { hasPurchased: false, price: 1.00 };
  }
  
  // Check if user has purchased the template
  const { data } = await supabase
    .from('template_purchases')
    .select()
    .eq('user_id', session.user.id)
    .eq('template_id', templateId)
    .single();
  
  return { 
    hasPurchased: !!data, 
    price: data ? null : 1.00  // If purchased, price is null (already owned)
  };
}

// Get all templates purchased by the user
export async function getUserPurchasedTemplates(): Promise<string[]> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return [];
  }
  
  const { data } = await supabase
    .from('template_purchases')
    .select('template_id')
    .eq('user_id', session.user.id);
  
  // Always include the free template
  const purchasedTemplates = [FREE_TEMPLATE_ID];
  
  if (data) {
    data.forEach(purchase => {
      purchasedTemplates.push(purchase.template_id);
    });
  }
  
  return purchasedTemplates;
}

// Track purchase history for the user
interface PurchaseHistory {
  id: string;
  template_id: string;
  purchased_at: string;
  amount_paid: number;
}

export async function getUserPurchaseHistory(): Promise<PurchaseHistory[]> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return [];
  }
  
  const { data } = await supabase
    .from('template_purchases')
    .select('id, template_id, purchased_at, amount_paid')
    .eq('user_id', session.user.id)
    .order('purchased_at', { ascending: false });
  
  return data || [];
}