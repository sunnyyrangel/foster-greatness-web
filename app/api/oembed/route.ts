import { NextRequest, NextResponse } from 'next/server';

const SITE_URL = 'https://www.fostergreatness.co';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  const format = request.nextUrl.searchParams.get('format') || 'json';
  const maxwidth = parseInt(request.nextUrl.searchParams.get('maxwidth') || '800', 10);
  const maxheight = parseInt(request.nextUrl.searchParams.get('maxheight') || '800', 10);

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  // Only handle our widget URLs
  if (!url.includes('/widgets/services')) {
    return NextResponse.json({ error: 'URL not supported' }, { status: 404 });
  }

  // Preserve any query params from the original URL (like ?zip=...)
  const embedUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`;

  const width = Math.min(maxwidth, 800);
  const height = Math.min(maxheight, 800);

  const oembedResponse = {
    type: 'rich',
    version: '1.0',
    title: 'Resource Search - Foster Greatness',
    provider_name: 'Foster Greatness',
    provider_url: SITE_URL,
    width,
    height,
    html: `<iframe src="${embedUrl}" width="${width}" height="${height}" style="border:none;width:100%;max-width:${width}px;" frameborder="0" scrolling="auto" allowfullscreen></iframe>`,
  };

  if (format === 'xml') {
    const xml = `<?xml version="1.0" encoding="utf-8"?>
<oembed>
  <type>${oembedResponse.type}</type>
  <version>${oembedResponse.version}</version>
  <title>${oembedResponse.title}</title>
  <provider_name>${oembedResponse.provider_name}</provider_name>
  <provider_url>${oembedResponse.provider_url}</provider_url>
  <width>${oembedResponse.width}</width>
  <height>${oembedResponse.height}</height>
  <html><![CDATA[${oembedResponse.html}]]></html>
</oembed>`;
    return new Response(xml, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  return NextResponse.json(oembedResponse, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}
