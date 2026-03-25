import Link from 'next/link'
import { Header } from '@/components/sections/Header'
import { Footer } from '@/components/sections/Footer'
import { VoiceDemo } from '@/components/sections/VoiceDemo'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-white">
      <Header />
      <main className="pt-16 lg:pt-20">
        <VoiceDemo />

        <section className="py-12 lg:py-16 bg-bg-primary border-t border-slate-800/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
            <p className="text-slate-300">
              Need a custom rollout plan after testing the live agent?
            </p>
            <p className="text-slate-400 text-sm">
              Book a workflow audit at{' '}
              <Link href="/form" className="text-amber-400 hover:text-amber-300 transition-colors">
                getoios.com/form
              </Link>{' '}
              or email{' '}
              <a href="mailto:team@getoios.com" className="text-amber-400 hover:text-amber-300 transition-colors">
                team@getoios.com
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
