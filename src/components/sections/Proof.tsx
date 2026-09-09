import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

/**
 * No links leave this section, by design. The old proof block pointed at a
 * subdomain that no longer resolves, and a dead link in the proof section is
 * worse than no link at all. What replaces it is an offer to show the log live
 * on the first call — which is a thing we can actually do.
 */
const claims = [
  {
    name: 'Same Jarvis, our business',
    body: 'Same rules, same read-backs, same log. If he can’t do it for us, it isn’t on this page.',
  },
  {
    name: 'See the log on the first call',
    body: 'We’ll put it on screen: what he did this morning, and what he asked us first.',
  },
  {
    name: 'Built in the open',
    body: 'Jarvis himself gets built and shipped in the open. Ask on the call and we’ll show you what landed this week.',
  },
  {
    name: 'No made-up numbers',
    body: 'You won’t find a “jobs booked” counter here. When the numbers are real, they’ll be real.',
  },
] as const

export function Proof() {
  return (
    <section id="proof" className="bg-bg-primary py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Proof"
          title="We run OIOS on Jarvis."
          sub="Our schedule, our invoices and our 7 AM briefing run through the same Jarvis you’d get. You’ll see it working live on the first call — real activity, not a mockup."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16">
          {claims.map((claim, i) => (
            <Reveal
              key={claim.name}
              delay={((i % 4) + 1) as 1 | 2 | 3 | 4}
              className="glass-card p-6 lg:p-7"
            >
              <h3 className="text-base font-semibold text-white sm:text-lg">{claim.name}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{claim.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
