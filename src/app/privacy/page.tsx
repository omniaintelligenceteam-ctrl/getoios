import type { Metadata } from 'next'
import { Header } from '@/components/sections/Header'
import { Footer } from '@/components/sections/Footer'
import { PageEntrance } from '@/components/ui/PageEntrance'
import { SectionTransition } from '@/components/ui/SectionTransition'

export const metadata: Metadata = {
  title: 'Privacy Policy — OIOS | AI Operations for Service Businesses',
  description:
    'How OIOS by Omnia Intelligence AI collects, uses, and protects your data. Your business data stays yours — always.',
  openGraph: {
    title: 'Privacy Policy — OIOS | AI Operations for Service Businesses',
    description:
      'How OIOS by Omnia Intelligence AI collects, uses, and protects your data. Your business data stays yours — always.',
    url: 'https://getoios.com/privacy',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Privacy Policy — OIOS by Omnia Intelligence AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy — OIOS | AI Operations for Service Businesses',
    description:
      'How OIOS by Omnia Intelligence AI collects, uses, and protects your data. Your business data stays yours — always.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://getoios.com/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <PageEntrance>
      <div className="bg-bg-primary text-white min-h-screen">
        <Header />

        {/* Hero */}
        <section className="relative bg-bg-primary overflow-hidden pt-28 pb-16 lg:pt-32 lg:pb-20">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(45,212,191,0.08) 0%, transparent 70%)',
            }}
          />
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-400/8 border border-teal-400/20 text-[11px] font-mono font-semibold uppercase tracking-[0.14em] text-teal-400 mb-5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-400" />
              </span>
              Legal
            </span>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight text-white mb-4"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}
            >
              Privacy Policy
            </h1>
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              Your data is your business. Here&apos;s exactly how we handle it.
            </p>
          </div>
        </section>

        <SectionTransition />

        {/* Content */}
        <section className="py-24 lg:py-32 bg-bg-primary relative">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-slate-500 font-mono mb-12">
              Last updated: March 23, 2026
            </p>

            <div className="space-y-16">
              {/* Intro */}
              <div>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Omnia Intelligence AI (&quot;we&quot;, &quot;us&quot;, &quot;OIOS&quot;) operates
                  the OIOS platform and the getoios.com website. This Privacy Policy explains what
                  data we collect, how we use it, and your rights regarding your information.
                </p>
              </div>

              {/* What We Collect */}
              <div className="glass-card p-8 border border-teal-400/20">
                <h2
                  className="text-2xl font-bold text-white mb-6"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  What We Collect
                </h2>
                <ul className="space-y-4 text-slate-400 text-base leading-relaxed">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>
                      <strong className="text-white">Contact information</strong> &mdash; name,
                      email, phone number, and business details submitted through forms on our site.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>
                      <strong className="text-white">Call data</strong> &mdash; call recordings and
                      transcripts generated by the AI receptionist when handling calls on your behalf.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>
                      <strong className="text-white">Calendar &amp; scheduling data</strong> &mdash;
                      appointment details, availability, and booking information.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>
                      <strong className="text-white">CRM &amp; business operation data</strong>{' '}
                      &mdash; leads, customer records, job details, and pipeline information you
                      manage through the platform.
                    </span>
                  </li>
                </ul>
              </div>

              {/* How We Use It */}
              <div className="glass-card p-8 border border-amber-400/20">
                <h2
                  className="text-2xl font-bold text-white mb-6"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  How We Use Your Data
                </h2>
                <ul className="space-y-4 text-slate-400 text-base leading-relaxed">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>To provide the OIOS platform services you signed up for.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>
                      To answer calls and manage leads on your behalf through the AI receptionist.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>To generate reports and analytics for your business.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>
                      To improve our AI systems using aggregated, anonymized data only &mdash; we
                      never use your raw business data for training.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Third-Party Services */}
              <div>
                <h2
                  className="text-2xl font-bold text-white mb-4"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  Third-Party Services
                </h2>
                <p className="text-slate-400 text-base leading-relaxed mb-4">
                  We use trusted third-party providers for infrastructure including cloud hosting,
                  telephony, calendar integration, and payment processing. These providers only
                  access your data as needed to deliver their services.
                </p>
                <p className="text-white font-medium text-base">
                  We do not sell your data to third parties. Ever.
                </p>
              </div>

              {/* Data Security */}
              <div className="glass-card p-8 border border-emerald-400/20">
                <h2
                  className="text-2xl font-bold text-white mb-6"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  Data Security
                </h2>
                <ul className="space-y-4 text-slate-400 text-base leading-relaxed">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>All data encrypted in transit (TLS) and at rest.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Access controls and authentication on all systems.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Regular security reviews and infrastructure audits.</span>
                  </li>
                </ul>
              </div>

              {/* Your Data, Your Choice */}
              <div>
                <h2
                  className="text-2xl font-bold text-white mb-4"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  Your Data, Your Choice
                </h2>
                <p className="text-slate-400 text-base leading-relaxed mb-6">
                  You&apos;re in control. At any time, you can:
                </p>
                <ul className="space-y-3 text-slate-400 text-base leading-relaxed mb-6">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>Request a copy of all data we hold about you.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>Request deletion of your data.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>Opt out of non-essential communications.</span>
                  </li>
                </ul>
                <p className="text-slate-400 text-base leading-relaxed">
                  For any data requests, email us at{' '}
                  <a
                    href="mailto:team@getoios.com"
                    className="text-teal-400 hover:text-teal-300 transition-colors"
                  >
                    team@getoios.com
                  </a>
                  .
                </p>
              </div>

              {/* CCPA */}
              <div className="glass-card p-8 border border-slate-700/30">
                <h2
                  className="text-2xl font-bold text-white mb-6"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  California Residents (CCPA)
                </h2>
                <p className="text-slate-400 text-base leading-relaxed mb-4">
                  If you&apos;re a California resident, you have additional rights under the
                  California Consumer Privacy Act:
                </p>
                <ul className="space-y-3 text-slate-400 text-base leading-relaxed">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>
                      <strong className="text-white">Right to know</strong> &mdash; what personal
                      data we collect and how we use it.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>
                      <strong className="text-white">Right to delete</strong> &mdash; request
                      deletion of your personal data.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>
                      <strong className="text-white">Right to opt out of sale</strong> &mdash; we
                      don&apos;t sell your data, but you have this right regardless.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>
                      <strong className="text-white">Right to non-discrimination</strong> &mdash;
                      exercising your privacy rights will never affect the service you receive.
                    </span>
                  </li>
                </ul>
              </div>

              {/* Changes */}
              <div>
                <h2
                  className="text-2xl font-bold text-white mb-4"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  Changes to This Policy
                </h2>
                <p className="text-slate-400 text-base leading-relaxed">
                  We may update this Privacy Policy from time to time. If we make material changes,
                  we&apos;ll notify you via email so you&apos;re always aware of how your data is
                  handled.
                </p>
              </div>

              {/* Contact */}
              <div className="glass-card p-8 border border-teal-400/20 text-center">
                <h2
                  className="text-2xl font-bold text-white mb-4"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  Questions?
                </h2>
                <p className="text-slate-400 text-base leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or your data, reach out to us.
                </p>
                <a
                  href="mailto:team@getoios.com"
                  className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors font-medium"
                >
                  team@getoios.com
                </a>
              </div>
            </div>
          </div>
        </section>

        <SectionTransition />
        <Footer />
      </div>
    </PageEntrance>
  )
}
