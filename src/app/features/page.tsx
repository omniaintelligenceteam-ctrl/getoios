import type { Metadata } from 'next'
import { Header } from '@/components/sections/Header'
import { PageHero } from '@/components/sections/PageHero'
import { SayItToJarvis } from '@/components/sections/SayItToJarvis'
import { KnowsYourBusiness } from '@/components/sections/KnowsYourBusiness'
import { WhileYouSleep } from '@/components/sections/WhileYouSleep'
import { FinalCTA } from '@/components/sections/FinalCTA'
import { Footer } from '@/components/sections/Footer'
import { PageEntrance } from '@/components/ui/PageEntrance'
import { SectionTransition } from '@/components/ui/SectionTransition'

const title = 'What Jarvis does'
const description =
  'The eight things owners hand Jarvis in the first month, what he does on his own, and what he stops to ask you about first.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: 'https://getoios.com/features',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'What Jarvis does — OIOS by Omnia Intelligence AI',
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
    canonical: 'https://getoios.com/features',
  },
}

export default function FeaturesPage() {
  return (
    <PageEntrance>
      <div className="bg-bg-primary text-white min-h-screen">
        <Header />
        <PageHero
          title="What Jarvis does"
          subtitle="Talk to him like you'd talk to a good office manager. Here's what he takes, and where he stops to ask."
          badge="What you can say"
        />
        <SectionTransition />
        <SayItToJarvis />
        <SectionTransition />
        <KnowsYourBusiness />
        <SectionTransition />
        <WhileYouSleep />
        <SectionTransition />
        <FinalCTA />
        <SectionTransition />
        <Footer />
      </div>
    </PageEntrance>
  )
}
