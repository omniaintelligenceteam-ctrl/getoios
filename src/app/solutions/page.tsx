import type { Metadata } from 'next'
import { Header } from '@/components/sections/Header'
import { PageHero } from '@/components/sections/PageHero'
import { SolutionsContent } from '@/components/sections/Solutions'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { Footer } from '@/components/sections/Footer'
import { PageEntrance } from '@/components/ui/PageEntrance'
import { SectionTransition } from '@/components/ui/SectionTransition'

const title = 'Thirteen things you can say to Jarvis'
const description =
  'Real sentences owners say, what happens when they do, and which ones stop for a yes first.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: 'https://getoios.com/solutions',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Thirteen things you can say to Jarvis — OIOS by Omnia Intelligence AI',
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
    canonical: 'https://getoios.com/solutions',
  },
}

export default function SolutionsPage() {
  return (
    <PageEntrance>
      <div className="bg-bg-primary text-white min-h-screen">
        <Header />
        <PageHero
          title="Thirteen things you can say to Jarvis"
          subtitle="One sentence each. What happens next, and which ones stop and wait for your yes."
          badge="Say it to Jarvis"
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
