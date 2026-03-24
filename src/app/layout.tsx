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
  metadataBase: new URL('https://getoios.com'),
  verification: {
    google: 'opWpVmIdfuvdOo0-FtRN0Uad-wFNI7IKtx',
  },
  icons: {
    icon: '/LOGO OIOS.jpg',
    apple: '/apple-touch-icon.png',
  },
  title: {
    default: "OIOS — Your AI-Powered Operations Team | Omnia Intelligence AI",
    template: "%s | OIOS by Omnia Intelligence AI",
  },
  description: "Answer every call. Capture every lead. Run every task. OIOS answers calls 24/7, automates back office workflows, and shows you every lead, job, and dollar in real time.",
  keywords: "AI operations, AI for service businesses, AI receptionist, AI back office, business automation, OIOS, Omnia Intelligence AI, AI office manager, contractor AI",
  openGraph: {
    title: "OIOS — AI-Powered Operations for Service Businesses",
    description: "OIOS answers calls 24/7, automates back office workflows, and shows you every lead, job, and dollar in real time. Free audit.",
    type: "website",
    url: "https://getoios.com",
    siteName: "OIOS by Omnia Intelligence AI",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "OIOS — AI Operations Platform for Service Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OIOS — AI-Powered Operations for Service Businesses",
    description: "OIOS answers calls 24/7, automates back office workflows, and shows you every lead, job, and dollar in real time. Free audit.",
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
    "description": "OIOS is an AI-powered operations platform for service businesses. It answers calls 24/7, automates back office workflows, and provides real-time visibility into leads, jobs, and revenue.",
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

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://getoios.com/#software",
    "name": "OIOS",
    "alternateName": "OIOS AI Operations Platform",
    "description": "AI-powered operations platform for service businesses. Includes 24/7 AI receptionist, automated scheduling, follow-up automation, CRM management, revenue tracking, and marketing content generation.",
    "url": "https://getoios.com",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web-based (SaaS)",
    "featureList": [
      "24/7 AI Receptionist",
      "Automated Lead Capture",
      "Appointment Scheduling",
      "Follow-Up Automation",
      "Proposal Generation",
      "CRM Management",
      "Revenue Tracking",
      "Marketing Content Generation",
    ],
    "publisher": { "@id": "https://getoios.com/#organization" },
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationSchema, websiteSchema, softwareSchema]),
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
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
