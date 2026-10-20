import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { gtmHeadScript, gtmNoscriptSrc } from "@/lib/gtm";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

// Supplied search and favicon set (Developer Update List item 3).
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      ...[48, 96, 144, 192, 512].map((size) => ({ url: `/favicon-${size}x${size}.png`, sizes: `${size}x${size}`, type: "image/png" })),
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{ __html: gtmHeadScript }} />
        <link rel="preconnect" href="https://fonts.cdnfonts.com" />
        {/* Harabara Mais Demo - Brand headline font */}
        <link
          href="https://fonts.cdnfonts.com/css/harabara-mais-demo"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe src={gtmNoscriptSrc} height="0" width="0" style={{ display: "none", visibility: "hidden" }} />
        </noscript>
        {children}
      </body>
    </html>
  );
}
