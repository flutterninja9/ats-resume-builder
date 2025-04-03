import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { LEMONSQUEEZY_API_KEY, LEMONSQUEEZY_API_URL } from '../create-session/route';

export async function GET(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const orderId = searchParams.get('order_id');
  
      if (!orderId) {
        return NextResponse.json(
          { error: 'Order ID is required' },
          { status: 400 }
        );
      }
  
      // Get auth session to identify the user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
  
      // Verify order with LemonSqueezy
      const response = await fetch(`${LEMONSQUEEZY_API_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${LEMONSQUEEZY_API_KEY}`,
        }
      });
      
      if (!response.ok) {
        console.error('LemonSqueezy order verification error:', await response.text());
        return NextResponse.json(
          { error: 'Order verification failed' },
          { status: 500 }
        );
      }
      
      const orderData = await response.json();
      
      // Extract custom data from the order
      const customData = orderData.data.attributes.custom_data || {};
      const userId = customData.user_id;
      const templateId = customData.template_id;
      
      // Verify the order belongs to this user
      if (userId !== session.user.id) {
        return NextResponse.json(
          { error: 'User ID mismatch' },
          { status: 403 }
        );
      }
      
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
        amount_paid: orderData.data.attributes.total / 100, // Convert from cents to dollars
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
  