import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.BEEHIIV_API_KEY;

    if (!apiKey) {
      console.error('Missing BEEHIIV_API_KEY environment variable');
      return NextResponse.json({ error: 'API configuration error' }, { status: 500 });
    }

    const response = await fetch(
      'https://api.beehiiv.com/v2/publications/pub_e597ede6-38aa-4b38-a981-ae7c8f63a77e/posts?status=confirmed&limit=3&order_by=publish_date&direction=desc',
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
