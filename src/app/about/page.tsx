import type { Metadata } from 'next'
import { Header } from '@/components/sections/Header'
import { PageHero } from '@/components/sections/PageHero'
import { AboutContent } from '@/components/sections/AboutContent'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { Footer } from '@/components/sections/Footer'
import { PageEntrance } from '@/components/ui/PageEntrance'
import { SectionTransition } from '@/components/ui/SectionTransition'

const title = 'Why we built Jarvis'
const description =
  'Ten years running a landscape lighting company across seven cities, needing a COO I couldn’t afford. Jarvis is what I built instead — and OIOS installs him in businesses like the one I ran.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: 'https://getoios.com/about',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Why we built Jarvis — OIOS by Omnia Intelligence AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/opengraph-image'],
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
          title="I needed a COO I couldn't afford."
          subtitle="So I built one. Then we started installing him in businesses like the one I ran."
          badge="Our story"
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
