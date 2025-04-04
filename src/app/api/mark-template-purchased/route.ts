import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { templateId, userId } = await req.json();
    
    if (!templateId || !userId) {
      return NextResponse.json(
        { error: 'Template ID and User ID are required' },
        { status: 400 }
      );
    }

    // Check if this template is already purchased
    const { data: existingPurchase } = await supabase
      .from('template_purchases')
      .select('id')
      .eq('user_id', userId)
      .eq('template_id', templateId)
      .single();

    if (existingPurchase) {
      // Template is already purchased, just return success
      return NextResponse.json({ success: true });
    }

    // Record the purchase in the database
    // Use a placeholder transaction ID since we don't have the real one from LemonSqueezy
    const { error: insertError } = await supabase.from('template_purchases').insert({
      user_id: userId,
      template_id: templateId,
      amount_paid: 1.00, // Default price
      transaction_id: `manual-${Date.now()}`, // Create a unique ID
    });

    if (insertError) {
      console.error('Error recording purchase:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to record purchase' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking template as purchased:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to mark template as purchased' },
      { status: 500 }
    );
  }
}