import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { MouseSpotlight } from "@/components/ui/MouseSpotlight";
import { PointerGlow } from "@/components/ui/pointer-glow";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ScrollRevealInit } from "@/components/ui/ScrollRevealInit";
import { RevealInit } from "@/components/ui/RevealInit";
import { MotionProvider } from "@/components/ui/MotionProvider";
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
  metadataBase: new URL('https://getoios.com'),
  verification: {
    google: 'opWpVmIdfuvdOo0-FtRN0Uad-wFNI7IKtx',
  },
  icons: {
    icon: '/LOGO OIOS.jpg',
    apple: '/apple-touch-icon.png',
  },
  title: {
    default: "Jarvis handles the day. Big decisions stay yours. | OIOS",
    template: "%s | OIOS by Omnia Intelligence AI",
  },
  description: "OIOS installs Jarvis, an AI Operating System for small businesses. Briefed by 7 AM, the day handled, anything that can't be undone read back to you first.",
  keywords: "AI operating system, AI COO for small business, AI for small businesses, AI back office, business automation, OIOS, Jarvis, Omnia Intelligence AI, small business AI",
  openGraph: {
    title: "Jarvis handles the day. Big decisions stay yours.",
    description: "OIOS installs Jarvis, an AI Operating System for small businesses. Briefed by 7 AM, the day handled, anything that can't be undone read back to you first.",
    type: "website",
    url: "https://getoios.com",
    siteName: "OIOS by Omnia Intelligence AI",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Jarvis — the AI Operating System OIOS installs for small businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jarvis handles the day. Big decisions stay yours.",
    description: "OIOS installs Jarvis, an AI Operating System for small businesses. Briefed by 7 AM, the day handled, anything that can't be undone read back to you first.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "https://getoios.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://getoios.com/#organization",
    "name": "Omnia Intelligence AI",
    "alternateName": "OIOS",
    "url": "https://getoios.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://getoios.com/LOGO%20OIOS.jpg",
      "width": 512,
      "height": 512,
    },
    "description": "OIOS installs AI Operating Systems for small businesses. Ours is named Jarvis: he briefs the owner by 7 AM, keeps the schedule, drafts the follow-ups and past-due chases, and reads back anything that can't be undone before it fires.",
    "email": "team@getoios.com",
    "telephone": "+1-480-305-0357",
    "contactPoint": [{
      "@type": "ContactPoint",
      "telephone": "+1-480-305-0357",
      "email": "team@getoios.com",
      "contactType": "sales",
      "availableLanguage": "English",
    }],
    "areaServed": { "@type": "Country", "name": "United States" },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://getoios.com/#website",
    "name": "OIOS",
    "alternateName": "OIOS by Omnia Intelligence AI",
    "url": "https://getoios.com",
    "publisher": { "@id": "https://getoios.com/#organization" },
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://getoios.com/#service",
    "name": "OIOS",
    "alternateName": "OIOS AI Operating System",
    "description": "AI-first operations partner for small businesses on a monthly retainer. OIOS installs Jarvis on the owner's rules, prices and tools, ships the first build live by Day 7, and keeps shipping every month. Anything irreversible is read back to the owner before it fires.",
    "url": "https://getoios.com",
    "provider": { "@id": "https://getoios.com/#organization" },
    "areaServed": { "@type": "Country", "name": "United States" },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "What Jarvis handles",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "A 7 AM briefing on the day ahead" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Scheduling, confirmations and reminders" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Quotes and follow-ups drafted" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Past-due invoice chases drafted for the owner to send" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Memory kept in plain files the owner owns" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom software builds shipped monthly" } },
      ],
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        {/*
          Stamps `js` on <html> before first paint. Every reveal animation hangs
          off `html.js`, so a browser that never runs this — or a crawler — gets
          the fully visible page instead of a screen of opacity-0 sections.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationSchema, websiteSchema, serviceSchema]),
          }}
        />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <div className="noise-overlay" aria-hidden="true" />
        <ScrollProgress />
        <MouseSpotlight />
        <PointerGlow />
        <CustomCursor />
        <ScrollRevealInit />
        <RevealInit />
        <SmoothScroll>
          <MotionProvider>
            {children}
          </MotionProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
