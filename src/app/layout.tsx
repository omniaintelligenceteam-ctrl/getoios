import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { MouseSpotlight } from "@/components/ui/MouseSpotlight";
import { PointerGlow } from "@/components/ui/pointer-glow";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ScrollRevealInit } from "@/components/ui/ScrollRevealInit";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://silentaipartner.com'),
  icons: {
    icon: '/logo-oios.jpg',
    apple: '/apple-touch-icon.png',
  },
  title: "OIOS — AI Operations for Service Businesses | Omnia Intelligence AI",
  description: "We install AI into your business. OIOS handles calls 24/7, automates your back office, and gives you a real-time command center — so you can focus on the actual work.",
  keywords: "AI operations, AI for service businesses, AI receptionist, AI back office, business automation, OIOS, Omnia Intelligence AI, AI office manager, contractor AI",
  openGraph: {
    title: "We Install AI Into Your Business. It Handles the Rest.",
    description: "OIOS handles calls, automates admin, and gives you a command center — 24/7. Free audit.",
    type: "website",
    url: "https://silentaipartner.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "We Install AI Into Your Business. It Handles the Rest.",
    description: "OIOS handles calls, automates admin, and gives you a command center — 24/7. Free audit.",
  },
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <div className="noise-overlay" aria-hidden="true" />
        <ScrollProgress />
        <MouseSpotlight />
        <PointerGlow />
        <CustomCursor />
        <ScrollRevealInit />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
