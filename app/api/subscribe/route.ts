import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, name, source } = await request.json();

    console.log('Subscription request:', { email, name: name || 'not provided', source: source || 'newsletter' });

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const apiKey = process.env.BEEHIIV_API_KEY;
    if (!apiKey) {
      console.error('Missing BEEHIIV_API_KEY environment variable');
      return NextResponse.json({ error: 'API configuration error' }, { status: 500 });
    }

    // Set UTM parameters based on source
    const utmParams = source === 'storytelling_guide'
      ? {
          referring_site: 'https://storytellers-collective.com',
          utm_source: 'website',
          utm_medium: 'pdf_download',
          utm_campaign: 'storytelling_guide'
        }
      : {
          referring_site: 'https://www.fostergreatness.co',
          utm_source: 'website',
          utm_medium: 'newsletter_signup',
          utm_campaign: 'newsletter_page'
        };

    const requestBody = {
      email: email,
      reactivate_existing: true,
      ...utmParams
    };

    console.log('Beehiiv API request body:', requestBody);

    const response = await fetch('https://api.beehiiv.com/v2/publications/pub_e597ede6-38aa-4b38-a981-ae7c8f63a77e/subscriptions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    console.log('Beehiiv API response status:', response.status);
    console.log('Beehiiv API response data:', data);

    if (!response.ok) {
      console.error('Beehiiv API error:', {
        status: response.status,
        statusText: response.statusText,
        data
      });
      return NextResponse.json({
        error: data.errors?.[0]?.detail || data.message || 'Subscription failed'
      }, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      subscription: data.data
    });

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
}