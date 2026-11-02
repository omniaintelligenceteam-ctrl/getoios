import type { Metadata } from 'next'
import { Header } from '@/components/sections/Header'
import { PageHero } from '@/components/sections/PageHero'
import { SolutionsContent } from '@/components/sections/Solutions'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { Footer } from '@/components/sections/Footer'
import { PageEntrance } from '@/components/ui/PageEntrance'
import { SectionTransition } from '@/components/ui/SectionTransition'

export const metadata: Metadata = {
  title: 'Solutions — 13 Workflows OIOS Automates for Your Business',
  description:
    'From unanswered messages to forgotten invoices, OIOS automates every repetitive task in your small business. 13 workflows. Zero manual work.',
  openGraph: {
    title: 'Solutions — 13 Workflows OIOS Automates for Your Business',
    description:
      'From unanswered messages to forgotten invoices, OIOS automates every repetitive task in your small business. 13 workflows. Zero manual work.',
    url: 'https://getoios.com/solutions',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Solutions — 13 Workflows OIOS Automates for Your Business — OIOS by Omnia AI Intelligence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solutions — 13 Workflows OIOS Automates for Your Business',
    description:
      'From unanswered messages to forgotten invoices, OIOS automates every repetitive task in your small business. 13 workflows. Zero manual work.',
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: 'https://getoios.com/solutions',
  },
}

export default function SolutionsPage() {
  return (
    <PageEntrance>
      <div className="bg-bg-primary text-white min-h-screen">
        <Header />
        <PageHero
          title="13 Workflows. Zero Manual Work."
          subtitle="Every repetitive task in your small business — answered, automated, and monitored."
          badge="Solutions"
        />
        <SectionTransition />
        <SolutionsContent />
        <SectionTransition />
        <FinalCTA />
        <SectionTransition />
        <Footer />
      </div>
    </PageEntrance>
  )
}
