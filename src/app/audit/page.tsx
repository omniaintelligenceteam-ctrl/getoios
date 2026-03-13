import type { Metadata } from 'next'
import { Header } from '@/components/sections/Header'
import { PageHero } from '@/components/sections/PageHero'
import { AuditForm } from '@/components/sections/AuditForm'
import { Footer } from '@/components/sections/Footer'
import { PageEntrance } from '@/components/ui/PageEntrance'
import { SectionTransition } from '@/components/ui/SectionTransition'

export const metadata: Metadata = {
  title: 'Book Your AI Operations Audit — OIOS',
  description:
    'Book your free 60-minute AI operations audit with OIOS. Four quick questions, and we\'ll show you exactly where AI saves your business the most time and money.',
}

export default function AuditPage() {
  return (
    <PageEntrance>
      <div className="bg-bg-primary text-white min-h-screen">
        <Header />
        <PageHero
          badge="Get Started"
          title="Book Your Free Audit"
          subtitle="4 questions. 30 seconds. We'll show you exactly where AI saves you the most time."
        />
        <SectionTransition />
        <AuditForm />
        <SectionTransition />
        <Footer />
      </div>
    </PageEntrance>
  )
}
