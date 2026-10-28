import type { Metadata } from 'next'
import { Header } from '@/components/sections/Header'
import { Footer } from '@/components/sections/Footer'
import { PageEntrance } from '@/components/ui/PageEntrance'
import { SectionTransition } from '@/components/ui/SectionTransition'

export const metadata: Metadata = {
  title: 'Jarvis Text Alerts — Opt In | OIOS by Omnia Intelligence AI',
  description:
    'How to opt in to OIOS Jarvis text alerts: automated reminders, schedule and task updates, and system alerts. Text START to opt in, STOP to opt out.',
  alternates: {
    canonical: 'https://getoios.com/sms',
  },
}

export default function SmsOptInPage() {
  return (
    <PageEntrance>
      <div className="bg-bg-primary text-white min-h-screen">
        <Header />

        <section className="relative bg-bg-primary overflow-hidden pt-28 pb-16 lg:pt-32 lg:pb-20">
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight text-white mb-4"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}
            >
              Jarvis Text Alerts
            </h1>
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Get automated alerts from Jarvis, the OIOS AI assistant, by text message.
            </p>
          </div>
        </section>

        <SectionTransition />

        <section className="py-20 lg:py-28 bg-bg-primary relative">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="glass-card p-8 border border-teal-400/20 text-center">
              <h2
                className="text-2xl font-bold text-white mb-4"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}
              >
                How to opt in
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-4">
                Text <strong className="text-white">START</strong> to{' '}
                <strong className="text-white">(270) 558-1448</strong> to receive Jarvis text
                alerts.
              </p>
              <p className="text-slate-400 text-base leading-relaxed">
                By texting START, you agree to receive recurring automated text messages from OIOS
                Jarvis alerts at the number you text from. Consent is not a condition of any
                purchase. You will receive one confirmation message after opting in.
              </p>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-white mb-4"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}
              >
                What you&apos;ll receive
              </h2>
              <ul className="space-y-3 text-slate-400 text-base leading-relaxed list-disc pl-5">
                <li>Reminders you scheduled with Jarvis.</li>
                <li>Calendar, schedule and task updates.</li>
                <li>Alerts when your connected business systems need attention.</li>
              </ul>
              <p className="text-slate-400 text-base leading-relaxed mt-4">
                Example: &quot;Jarvis: Reminder you set: call the supplier back at 2 PM today.
                Reply STOP to opt out.&quot;
              </p>
            </div>

            <div className="glass-card p-8 border border-amber-400/20">
              <h2
                className="text-2xl font-bold text-white mb-4"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}
              >
                The fine print
              </h2>
              <ul className="space-y-3 text-slate-400 text-base leading-relaxed list-disc pl-5">
                <li>Program name: OIOS Jarvis alerts.</li>
                <li>Message frequency varies. Message and data rates may apply.</li>
                <li>Reply STOP at any time to opt out. Reply HELP for help.</li>
                <li>Help: team@getoios.com.</li>
                <li>Carriers are not liable for delayed or undelivered messages.</li>
                <li>
                  No mobile information will be shared with third parties or affiliates for
                  marketing or promotional purposes.
                </li>
              </ul>
              <p className="text-slate-400 text-base leading-relaxed mt-4">
                See our{' '}
                <a href="/privacy" className="text-teal-400 hover:text-teal-300 transition-colors">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="/terms#sms" className="text-teal-400 hover:text-teal-300 transition-colors">
                  SMS Terms
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        <SectionTransition />
        <Footer />
      </div>
    </PageEntrance>
  )
}
