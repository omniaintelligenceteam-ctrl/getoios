import type { Metadata } from 'next'
import { Header } from '@/components/sections/Header'
import { PageHero } from '@/components/sections/PageHero'
import { HowItWorksNew } from '@/components/sections/HowItWorksNew'
import { TrustSignals } from '@/components/sections/TrustSignals'
import { Testimonials } from '@/components/sections/Testimonials'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { Footer } from '@/components/sections/Footer'
import { PageEntrance } from '@/components/ui/PageEntrance'
import { SectionTransition } from '@/components/ui/SectionTransition'

export const metadata: Metadata = {
  title: 'How OIOS Works — Audit, Build, Run',
  description:
    'A simple 3-step process: we audit your current operations, build your AI systems, and run them for you — so you can focus on the work, not the admin.',
  openGraph: {
    title: 'How OIOS Works — Audit, Build, Run',
    description:
      'A simple 3-step process: we audit your current operations, build your AI systems, and run them for you — so you can focus on the work, not the admin.',
    url: 'https://getoios.com/how-it-works',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'How OIOS Works — Audit, Build, Run — OIOS by Omnia Intelligence AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How OIOS Works — Audit, Build, Run',
    description:
      'A simple 3-step process: we audit your current operations, build your AI systems, and run them for you — so you can focus on the work, not the admin.',
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: 'https://getoios.com/how-it-works',
  },
}

export default function HowItWorksPage() {
  return (
    <PageEntrance>
      <div className="bg-bg-primary text-white min-h-screen">
        <Header />
        <PageHero
          title="How It Works"
          subtitle="Audit. Build. Run. Three steps to AI operations."
          badge="Process"
        />
        <SectionTransition />
        <HowItWorksNew />
        <SectionTransition />
        <TrustSignals />
        <SectionTransition />
        <Testimonials />
        <SectionTransition />
        <FinalCTA />
        <SectionTransition />
        <Footer />
      </div>
    </PageEntrance>
  )
}
