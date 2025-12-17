import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.BEEHIIV_API_KEY;

    if (!apiKey) {
      console.error('Missing BEEHIIV_API_KEY environment variable');
      return NextResponse.json({ error: 'API configuration error' }, { status: 500 });
    }

    // Get limit from query params, default to 3, max 50
    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get('limit');
    const limit = Math.min(Math.max(parseInt(limitParam || '3', 10) || 3, 1), 50);

    const response = await fetch(
      `https://api.beehiiv.com/v2/publications/pub_e597ede6-38aa-4b38-a981-ae7c8f63a77e/posts?status=confirmed&platform=both&limit=${limit}&order_by=publish_date&direction=desc`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        next: {
          revalidate: 3600, // Cache for 1 hour
        },
      }
    );

    if (!response.ok) {
      console.error('Beehiiv API error:', response.status, response.statusText);
      return NextResponse.json({ error: 'Failed to fetch newsletters' }, { status: response.status });
    }

    const data = await response.json();

    // Transform the response to match the expected format
    const newsletters = data.data?.map((post: any) => ({
      id: post.id,
      web_url: post.web_url,
      thumbnail_url: post.thumbnail_url,
      title: post.title,
      subtitle: post.subtitle,
    })) || [];

    return NextResponse.json(newsletters);

  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
