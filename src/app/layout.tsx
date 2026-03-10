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
  title: "OIOS — Your AI-Powered Operations Team | Omnia Intelligence AI",
  description: "Answer every call. Capture every lead. Run every task. OIOS answers calls 24/7, kills your paperwork, and shows you every lead, job, and dollar in real time.",
  keywords: "AI operations, AI for service businesses, AI receptionist, AI back office, business automation, OIOS, Omnia Intelligence AI, AI office manager, contractor AI",
  openGraph: {
    title: "Answer Every Call. Capture Every Lead. Run Every Task. See Everything. 24/7.",
    description: "OIOS answers calls 24/7, kills your paperwork, and shows you every lead, job, and dollar in real time. Free audit.",
    type: "website",
    url: "https://silentaipartner.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Answer Every Call. Capture Every Lead. Run Every Task. See Everything. 24/7.",
    description: "OIOS answers calls 24/7, kills your paperwork, and shows you every lead, job, and dollar in real time. Free audit.",
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
