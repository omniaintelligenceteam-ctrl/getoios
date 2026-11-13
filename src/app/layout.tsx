import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { MouseSpotlight } from "@/components/ui/MouseSpotlight";
import { PointerGlow } from "@/components/ui/pointer-glow";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ScrollRevealInit } from "@/components/ui/ScrollRevealInit";
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
    icon: [{ url: '/icon.png', type: 'image/png', sizes: '512x512' }],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  title: {
    default: "Jarvis, three hires in one | Omnia AI Intelligence",
    template: "%s | OIOS by Omnia AI Intelligence",
  },
  description: "Jarvis is your assistant for your business and your life, your chief of staff, and your full management team. Omnia AI Intelligence installs him. Nothing is spent, sent or deleted without your tap.",
  keywords: "Jarvis, assistant for your business and your life, chief of staff, management team, small business, OIOS, Omnia AI Intelligence",
  openGraph: {
    title: "Jarvis. Three hires in one.",
    description: "Jarvis is your assistant for your business and your life, your chief of staff, and your full management team. Nothing is spent, sent or deleted without your tap.",
    type: "website",
    url: "https://getoios.com",
    siteName: "OIOS by Omnia AI Intelligence",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Jarvis, three hires in one, installed by Omnia AI Intelligence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jarvis. Three hires in one.",
    description: "Jarvis is your assistant for your business and your life, your chief of staff, and your full management team. Nothing is spent, sent or deleted without your tap.",
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
    "name": "Omnia AI Intelligence",
    "alternateName": "OIOS",
    "url": "https://getoios.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://getoios.com/icon.png",
      "width": 512,
      "height": 512,
    },
    "description": "Omnia AI Intelligence (OIOS) installs Jarvis for small businesses. Jarvis is your assistant for your business and your life, your chief of staff, and your full management team. Every outbound message waits for the owner's approval.",
    "email": "team@getoios.com",
    "contactPoint": [{
      "@type": "ContactPoint",
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
    "alternateName": "OIOS by Omnia AI Intelligence",
    "url": "https://getoios.com",
    "publisher": { "@id": "https://getoios.com/#organization" },
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://getoios.com/#service",
    "name": "OIOS",
    "alternateName": "Jarvis by OIOS",
    "description": "OIOS installs Jarvis for small businesses: your assistant for your business and your life, your chief of staff, and your full management team. One meeting a month and a new build each month. The owner owns everything.",
    "url": "https://getoios.com",
    "provider": { "@id": "https://getoios.com/#organization" },
    "areaServed": { "@type": "Country", "name": "United States" },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "OIOS capabilities",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Customer replies and quotes drafted for approval" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Appointment scheduling and reminders" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Follow-up and pipeline automation" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Invoicing and cash-flow reporting" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom software builds shipped monthly" } },
      ],
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
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
        <SmoothScroll>
          <MotionProvider>
            {children}
          </MotionProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
