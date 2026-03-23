import type { Metadata } from 'next'
import { Header } from '@/components/sections/Header'
import { PageHero } from '@/components/sections/PageHero'
import { AboutContent } from '@/components/sections/AboutContent'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { Footer } from '@/components/sections/Footer'
import { PageEntrance } from '@/components/ui/PageEntrance'
import { SectionTransition } from '@/components/ui/SectionTransition'

export const metadata: Metadata = {
  title: 'About — OIOS | The AI COO for Service Businesses',
  description:
    'The story behind OIOS — the AI COO built for service businesses. Learn why we built it, how it works, and our commitment to your data security.',
  openGraph: {
    title: 'About — OIOS | The AI COO for Service Businesses',
    description:
      'The story behind OIOS — the AI COO built for service businesses. Learn why we built it, how it works, and our commitment to your data security.',
    url: 'https://getoios.com/about',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'About — OIOS | The AI COO for Service Businesses — OIOS by Omnia Intelligence AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About — OIOS | The AI COO for Service Businesses',
    description:
      'The story behind OIOS — the AI COO built for service businesses. Learn why we built it, how it works, and our commitment to your data security.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://getoios.com/about',
  },
}

export default function AboutPage() {
  return (
    <PageEntrance>
      <div className="bg-bg-primary text-white min-h-screen">
        <Header />
        <PageHero
          title="Built for Contractors. By People Who Get It."
          subtitle="OIOS exists because service businesses deserve operations that actually work — without hiring an army to run them."
          badge="Our Story"
        />
        <SectionTransition />
        <AboutContent />
        <SectionTransition />
        <FinalCTA />
        <SectionTransition />
        <Footer />
      </div>
    </PageEntrance>
  )
}
