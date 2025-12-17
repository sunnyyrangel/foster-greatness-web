import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { defaultMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/react";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
        {/* PieEye Cookie Consent */}
        <script
          src="https://cdn.cookie.pii.ai/1/release/1.5/main.js"
          id="pieyecookiejs"
          config-url="https://cdn.cookie.pii.ai/scripts/1/ws/591fbdeb-4447-4956-8f0a-24ddd522756e/domain/e8be94d0-b62c-4074-ab82-7e714d941fd5/config-e8be94d0-b62c-4074-ab82-7e714d941fd5.json"
        />
        {/* PieEye DNSS Script */}
        <link
          rel="stylesheet"
          href="https://pieeyegpc.pii.ai/1/dsrp/d83d4059-4713-4f4f-a8a2-6e0ea59c7eff/gpc.css"
        />
        <script
          src="https://pieeyegpc.pii.ai/1/dsrp/d83d4059-4713-4f4f-a8a2-6e0ea59c7eff/gpc.min.js"
          async
        />
      </head>
      <body
        className={`${poppins.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
