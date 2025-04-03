import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
    try {
      // Get the raw request body
      const rawBody = await req.text();
      
      // Verify webhook signature
      const signature = req.headers.get('x-signature') || '';
      
      // This is where you would verify the signature using your webhook secret
      // For simplicity, we're skipping actual verification in this example
      
      // Parse the payload
      const payload = JSON.parse(rawBody);
      const eventName = payload.meta.event_name;
      
      // Only process order_created events
      if (eventName === 'order_created') {
        const orderId = payload.data.id;
        const customData = payload.data.attributes.custom_data || {};
        const userId = customData.user_id;
        const templateId = customData.template_id;
        
        if (!userId || !templateId) {
          console.error('Missing custom data in webhook:', customData);
          return NextResponse.json({ error: 'Missing custom data' }, { status: 400 });
        }
        
        // Check if we've already processed this order
        const { data: existingPurchase } = await supabase
          .from('template_purchases')
          .select('id')
          .eq('transaction_id', orderId)
          .single();
        
        if (existingPurchase) {
          return NextResponse.json({ status: 'already_processed' });
        }
        
        // Record the purchase
        await supabase.from('template_purchases').insert({
          user_id: userId,
          template_id: templateId,
          amount_paid: payload.data.attributes.total / 100, // Convert from cents to dollars
          transaction_id: orderId,
        });
        
        return NextResponse.json({ success: true });
      }
      
      // For other events, just acknowledge receipt
      return NextResponse.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      return NextResponse.json(
        { error: 'Webhook processing failed', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      );
    }
  }