import Link from 'next/link'
import { Header } from '@/components/sections/Header'
import { Footer } from '@/components/sections/Footer'
import { VoiceDemo } from '@/components/sections/VoiceDemo'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-white">
      <Header />
      <main className="pt-16 lg:pt-20">
        <section className="py-20 lg:py-24 bg-bg-primary border-b border-slate-800/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <div className="text-3xl font-bold text-white">O</div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Live Demo
            </h1>
            <p className="text-slate-400 text-lg sm:text-xl max-w-3xl mx-auto">
              Talk to Sarah — your OIOS AI receptionist. Test the live experience right now.
            </p>
            <a
              href="tel:+18667821303"
              className="inline-block mt-4 text-amber-400 hover:text-amber-300 transition-colors font-mono text-sm"
            >
              OIOS Business Line &bull; (866) 782-1303
            </a>
          </div>
        </section>

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
