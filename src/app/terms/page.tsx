import type { Metadata } from 'next'
import { Header } from '@/components/sections/Header'
import { Footer } from '@/components/sections/Footer'
import { PageEntrance } from '@/components/ui/PageEntrance'
import { SectionTransition } from '@/components/ui/SectionTransition'

export const metadata: Metadata = {
  title: 'Terms of Service — OIOS | AI Operations for Small Businesses',
  description:
    'Terms of Service for OIOS by Omnia Intelligence AI. No long-term contracts, no cancellation fees — just AI operations that work.',
  openGraph: {
    title: 'Terms of Service — OIOS | AI Operations for Small Businesses',
    description:
      'Terms of Service for OIOS by Omnia Intelligence AI. No long-term contracts, no cancellation fees — just AI operations that work.',
    url: 'https://getoios.com/terms',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Terms of Service — OIOS by Omnia Intelligence AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service — OIOS | AI Operations for Small Businesses',
    description:
      'Terms of Service for OIOS by Omnia Intelligence AI. No long-term contracts, no cancellation fees — just AI operations that work.',
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: 'https://getoios.com/terms',
  },
}

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
              No legalese maze. Here&apos;s how OIOS works, what we expect, and what you can expect
              from us.
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
                  These Terms of Service (&quot;Terms&quot;) govern your use of the OIOS platform
                  and services provided by Omnia Intelligence AI (&quot;Company&quot;,
                  &quot;we&quot;, &quot;us&quot;). By using OIOS, you agree to these Terms.
                </p>
              </div>

              {/* Service Description */}
              <div className="glass-card p-8 border border-teal-400/20">
                <h2
                  className="text-2xl font-bold text-white mb-6"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  What OIOS Does
                </h2>
                <p className="text-slate-400 text-base leading-relaxed mb-4">
                  OIOS provides AI-powered operations for small businesses, including:
                </p>
                <ul className="space-y-3 text-slate-400 text-base leading-relaxed">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>AI receptionist &mdash; answers calls, qualifies leads, books jobs.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>Automated scheduling and calendar management.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>Follow-up automation for leads and customers.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>CRM management and pipeline tracking.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>Revenue tracking and business analytics.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>Marketing content generation.</span>
                  </li>
                </ul>
              </div>

              {/* Eligibility */}
              <div>
                <h2
                  className="text-2xl font-bold text-white mb-4"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  Eligibility
                </h2>
                <p className="text-slate-400 text-base leading-relaxed">
                  You must be at least 18 years old and authorized to bind your business to these
                  Terms. By creating an account, you represent that you have the authority to enter
                  into this agreement on behalf of your business.
                </p>
              </div>

              {/* Your Account */}
              <div>
                <h2
                  className="text-2xl font-bold text-white mb-4"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  Your Account
                </h2>
                <p className="text-slate-400 text-base leading-relaxed">
                  You&apos;re responsible for maintaining the security of your account credentials
                  and for all activity under your account. If you suspect unauthorized access, notify
                  us immediately at{' '}
                  <a
                    href="mailto:team@getoios.com"
                    className="text-teal-400 hover:text-teal-300 transition-colors"
                  >
                    team@getoios.com
                  </a>
                  .
                </p>
              </div>

              {/* Acceptable Use */}
              <div className="glass-card p-8 border border-amber-400/20">
                <h2
                  className="text-2xl font-bold text-white mb-6"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  Acceptable Use
                </h2>
                <p className="text-slate-400 text-base leading-relaxed mb-4">
                  When using OIOS, you agree to:
                </p>
                <ul className="space-y-3 text-slate-400 text-base leading-relaxed">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Use the platform for legitimate business operations only.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>
                      Not attempt to reverse-engineer, disrupt, or misuse the AI systems.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Not use the platform for any illegal purposes.</span>
                  </li>
                </ul>
              </div>

              {/* Your Data */}
              <div>
                <h2
                  className="text-2xl font-bold text-white mb-4"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  Your Data
                </h2>
                <p className="text-slate-400 text-base leading-relaxed mb-2">
                  <strong className="text-white">You own your business data.</strong> We process it
                  solely to provide OIOS services to you.
                </p>
                <p className="text-slate-400 text-base leading-relaxed">
                  See our{' '}
                  <a
                    href="/privacy"
                    className="text-teal-400 hover:text-teal-300 transition-colors"
                  >
                    Privacy Policy
                  </a>{' '}
                  for full details on how we collect, use, and protect your information.
                </p>
              </div>

              {/* AI-Generated Content */}
              <div className="glass-card p-8 border border-emerald-400/20">
                <h2
                  className="text-2xl font-bold text-white mb-6"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  AI-Generated Content
                </h2>
                <p className="text-slate-400 text-base leading-relaxed mb-4">
                  OIOS generates content on your behalf &mdash; including emails, follow-up messages,
                  reports, and marketing materials.
                </p>
                <p className="text-white font-medium text-base">
                  You&apos;re responsible for reviewing and approving AI-generated communications
                  before they&apos;re sent to your customers.
                </p>
              </div>

              {/* Availability */}
              <div>
                <h2
                  className="text-2xl font-bold text-white mb-4"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  Availability
                </h2>
                <p className="text-slate-400 text-base leading-relaxed">
                  We target 99.9% uptime but do not guarantee uninterrupted service. We&apos;ll
                  notify you of planned maintenance in advance whenever possible.
                </p>
              </div>

              {/* Payment */}
              <div>
                <h2
                  className="text-2xl font-bold text-white mb-4"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  Payment
                </h2>
                <p className="text-slate-400 text-base leading-relaxed">
                  Pricing is as agreed in your selected plan. We may adjust pricing with 30 days
                  written notice. You will always have the option to cancel before new pricing takes
                  effect.
                </p>
              </div>

              {/* Cancellation */}
              <div className="glass-card p-8 border border-teal-400/20">
                <h2
                  className="text-2xl font-bold text-white mb-6"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  Cancellation
                </h2>
                <ul className="space-y-3 text-slate-400 text-base leading-relaxed">
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>You can cancel anytime.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>No long-term contracts.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-teal-400" />
                    <span>No cancellation fees.</span>
                  </li>
                </ul>
              </div>

              {/* Limitation of Liability */}
              <div>
                <h2
                  className="text-2xl font-bold text-white mb-4"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  Limitation of Liability
                </h2>
                <p className="text-slate-400 text-base leading-relaxed mb-4">
                  OIOS is provided &quot;as is.&quot; We are not liable for lost revenue, missed
                  calls due to system outages, or decisions made based on AI-generated insights.
                </p>
                <p className="text-slate-400 text-base leading-relaxed">
                  Our total liability is limited to the fees you paid in the 12 months preceding the
                  claim.
                </p>
              </div>

              {/* Indemnification */}
              <div>
                <h2
                  className="text-2xl font-bold text-white mb-4"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  Indemnification
                </h2>
                <p className="text-slate-400 text-base leading-relaxed">
                  You agree to indemnify and hold Omnia Intelligence AI harmless against any claims
                  arising from your use of the platform or your customers&apos; interactions with
                  AI-generated content.
                </p>
              </div>

              {/* Governing Law */}
              <div>
                <h2
                  className="text-2xl font-bold text-white mb-4"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  Governing Law
                </h2>
                <p className="text-slate-400 text-base leading-relaxed">
                  These Terms are governed by and construed in accordance with the laws of the State
                  of Texas, without regard to conflict of law principles.
                </p>
              </div>

              {/* Changes */}
              <div>
                <h2
                  className="text-2xl font-bold text-white mb-4"
                  style={{ fontFamily: 'var(--font-display), sans-serif' }}
                >
                  Changes to These Terms
                </h2>
                <p className="text-slate-400 text-base leading-relaxed">
                  We may update these Terms from time to time. Continued use of OIOS after changes
                  are posted constitutes acceptance of the updated Terms.
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
                  If you have any questions about these Terms, reach out to us.
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
