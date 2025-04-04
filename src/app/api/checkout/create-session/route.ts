import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { lemonSqueezySetup, createCheckout } from '@lemonsqueezy/lemonsqueezy.js';


export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { templateId, templateName, userData, returnUrl } = await req.json();
    
    // Validate userData
    if (!userData || !userData.id) {
      return NextResponse.json(
        { error: 'User data is required' },
        { status: 400 }
      );
    }

    // Setup LemonSqueezy with your API key
    lemonSqueezySetup({
      apiKey: process.env.LEMONSQUEEZY_API_KEY,
      onError: (error) => console.error("LemonSqueezy error:", error),
    });

    // Create checkout using the SDK
    const { data: checkoutData, error: checkoutError } = await createCheckout(
      parseInt(process.env.LEMONSQUEEZY_STORE_ID || '0'),
      parseInt(process.env.LEMONSQUEEZY_TEMPLATE_VARIANT_ID || '0'),
      {
        productOptions: {
          name: `Resume Template: ${templateName}`,
          description: `Purchase of the ${templateName} resume template`,
          redirectUrl: `${returnUrl}?template_id=${templateId}`,
          receiptThankYouNote: 'Thank you for your purchase! Your template is now unlocked.',
          receiptLinkUrl: returnUrl,
          receiptButtonText: 'Return to Resume Builder',
        },
        checkoutOptions: {
          embed: false,
          media: false,
          logo: true,
        },
        checkoutData: {
          email: userData.email || '',
          custom: {
            user_id: userData.id,
            template_id: templateId,
          },
        },
      }
    );

    if (checkoutError) {
      console.error('LemonSqueezy checkout error:', checkoutError);
      return NextResponse.json(
        { error: 'Failed to create checkout: ' + checkoutError.message },
        { status: 500 }
      );
    }

    if (!checkoutData) {
      return NextResponse.json(
        { error: 'Failed to create checkout: No data returned' },
        { status: 500 }
      );
    }
    
    // Get the checkout URL and ID
    const checkoutUrl = checkoutData.data.attributes.url;
    const checkoutId = checkoutData.data.id;
    
    // Store checkout info in database
    try {
      await supabase.from('checkout_sessions').insert({
        user_id: userData.id,
        template_id: templateId,
        checkout_id: checkoutId,
        status: 'pending'
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue even if database insert fails
    }

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