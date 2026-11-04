import { Shield, Calendar, MapPin } from 'lucide-react'

// Named examples already presented on this site. Availability is scoped per engagement.
const connections = [
  { name: 'Google Calendar', role: 'Scheduling', description: 'Discuss availability, appointment handoffs, and the calendar your team already uses.' },
  { name: 'Gmail', role: 'Customer messages', description: 'Agree which inbox Jarvis can read and where reply drafts belong.' },
  { name: 'QuickBooks · Stripe', role: 'Billing', description: 'Scope invoice and payment-record handoffs around your existing accounts.' },
  { name: 'Slack', role: 'Your team', description: 'Choose where your team reviews updates and brings work back to the owner.' },
  { name: 'ServiceTitan · Housecall Pro · Jobber', role: 'Service operations', description: 'Check the job and customer records you need, plus the access your software allows.' },
]

// ─── Trust cards data ────────────────────────────────────────────────────────
const trustCards = [
  {
    icon: Shield,
    title: 'You Own Everything',
    description: 'Every tool, every integration, every piece of data we build is yours. If you ever leave, it all walks with you.',
  },
  {
    icon: Calendar,
    title: 'Month-to-Month',
    description: 'No contracts. Cancel anytime. We earn the retainer every 30 days or you stop paying it.',
  },
  {
    icon: MapPin,
    title: 'Founded in Scottsdale, AZ',
    description: 'Real people. Real company. A human partner who knows your business, not a ticket queue.',
  },
]

// ─── Trust Card component ────────────────────────────────────────────────────
function TrustCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Shield
  title: string
  description: string
}) {
  return (
    <div
      className="glass-card p-6 lg:p-8 text-center relative"
      data-glow
    >
      <div className="relative inline-flex items-center justify-center mb-5">
        <div className="w-14 h-14 rounded-full bg-teal-400/10 border border-teal-400/20 flex items-center justify-center relative">
          <Icon aria-hidden="true" className="w-6 h-6 text-teal-400" />
        </div>
      </div>
      <h3
        className="text-lg font-bold text-white mb-2"
        style={{ fontFamily: 'var(--font-display), sans-serif' }}
      >
        {title}
      </h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function TrustSignals() {

  return (
    <section className="py-24 lg:py-32 bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-800/40 border border-slate-700/30 mb-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-400">The Partner Model</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            <span className="text-white">No contracts. No lock-in.</span>
            <br />
            <span className="gradient-text">You own everything.</span>
          </h2>
        </div>

        <div role="region" aria-labelledby="connections-heading" className="mb-16">
          <div className="max-w-2xl mb-8">
            <h3 id="connections-heading" className="text-2xl sm:text-3xl font-bold text-white">Connections to scope with you</h3>
            <p className="mt-4 text-slate-300 leading-relaxed">Start with the tools you already use. We check availability and access during the install, then agree which connections your build needs. These examples are not a promise that every connection is included or ready for your account.</p>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {connections.map(connection => (
              <li key={connection.name} className="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-6">
                <p className="text-xs text-teal-300 font-mono mb-3">{connection.role}</p>
                <h4 className="font-semibold text-white leading-snug">{connection.name}</h4>
                <p className="mt-3 text-sm text-slate-300 leading-relaxed">{connection.description}</p>
              </li>
            ))}
          </ul>
          <p className="mt-5 border-l-2 border-teal-400 pl-4 text-sm text-slate-300 leading-relaxed">Access follows the scope you approve. Connecting an account does not authorize customer messages or money movement.</p>
        </div>

        {/* Trust cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {trustCards.map(card => (
            <TrustCard key={card.title} {...card} />
          ))}
        </div>

      </div>
    </section>
  )
}
