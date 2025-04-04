// src/app/api/checkout/verify-order/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { lemonSqueezySetup, getOrder } from '@lemonsqueezy/lemonsqueezy.js';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('order_id');
    const userId = searchParams.get('user_id'); // Get user ID from query params

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Setup LemonSqueezy with your API key
    lemonSqueezySetup({
      apiKey: process.env.LEMONSQUEEZY_API_KEY || '',
      onError: (error) => console.error("LemonSqueezy error:", error),
    });

    // Get order details from LemonSqueezy
    const { data: orderData, error: orderError } = await getOrder(orderId);

    if (orderError) {
      console.error('LemonSqueezy order verification error:', orderError);
      return NextResponse.json(
        { error: 'Order verification failed: ' + orderError.message },
        { status: 500 }
      );
    }

    if (!orderData) {
      return NextResponse.json(
        { error: 'Failed to verify order: No data returned' },
        { status: 500 }
      );
    }
    
    // Extract custom data from the order
    const customData = orderData.data || {};
    const templateId = customData.id;
    
    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID missing from order' },
        { status: 400 }
      );
    }

    // Record the purchase in the database
    const { error: insertError } = await supabase.from('template_purchases').insert({
      user_id: userId,
      template_id: templateId,
      // amount_paid: orderData.total / 100, // Convert from cents to dollars
      transaction_id: orderId,
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
    console.error('Error verifying order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}