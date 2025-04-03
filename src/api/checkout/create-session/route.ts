import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// LemonSqueezy API URL
export const LEMONSQUEEZY_API_URL = 'https://api.lemonsqueezy.com/v1';

// LemonSqueezy API Key (get from environment variables)
export const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY || '';

// LemonSqueezy Store ID (get from environment variables)
export const LEMONSQUEEZY_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID || '';

// LemonSqueezy Template Product ID (get from environment variables)
export const LEMONSQUEEZY_TEMPLATE_PRODUCT_ID = process.env.LEMONSQUEEZY_TEMPLATE_PRODUCT_ID || '';

// LemonSqueezy Template Variant ID (get from environment variables)
export const LEMONSQUEEZY_TEMPLATE_VARIANT_ID = process.env.LEMONSQUEEZY_TEMPLATE_VARIANT_ID || '';

export async function POST(req: NextRequest) {
  try {
    // Get auth session to identify the user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const { templateId, templateName, returnUrl } = await req.json();

    // Create checkout with LemonSqueezy
    const response = await fetch(`${LEMONSQUEEZY_API_URL}/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${LEMONSQUEEZY_API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            store_id: parseInt(LEMONSQUEEZY_STORE_ID),
            checkout_data: {
              product_id: LEMONSQUEEZY_TEMPLATE_PRODUCT_ID,
              variant_id: LEMONSQUEEZY_TEMPLATE_VARIANT_ID,
              custom_price: null, // Use product's price
              name: `Resume Template: ${templateName}`,
              description: `Purchase of the ${templateName} resume template`,
              redirect_url: `${returnUrl}?template_id=${templateId}`,
              receipt_button_text: 'Return to Resume Builder',
              receipt_link_url: returnUrl,
              receipt_thank_you_note: 'Thank you for your purchase! Your template is now unlocked.',
              enabled_variants: [LEMONSQUEEZY_TEMPLATE_VARIANT_ID],
            },
            custom_data: {
              user_id: session.user.id,
              template_id: templateId,
            },
            product_options: {
              enabled_variants: [LEMONSQUEEZY_TEMPLATE_VARIANT_ID],
              redirect_url: `${returnUrl}?template_id=${templateId}`,
            },
          },
        },
      }),
    });
    
    if (!response.ok) {
      console.error('LemonSqueezy checkout error:', await response.text());
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }
    
    const checkoutResponse = await response.json();
    const checkoutUrl = checkoutResponse.data.attributes.url;
    const checkoutId = checkoutResponse.data.id;
    
    // Store checkout info in database for verification later
    await supabase.from('checkout_sessions').insert({
      user_id: session.user.id,
      template_id: templateId,
      checkout_id: checkoutId,
      status: 'pending'
    });

    return NextResponse.json({
      url: checkoutUrl,
      checkoutId: checkoutId,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}