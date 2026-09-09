import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

/**
 * Five overnight jobs, and only five.
 *
 * The lead, quote and conflict sweeps exist but ship OFF by default, so they
 * are not on this list — a page that promises them would be promising a switch
 * the owner has not flipped.
 */
const overnight = [
  {
    time: '3:30',
    name: 'Backup',
    body: 'Your data, copied. Every night, before anything else touches it.',
  },
  {
    time: '4:30',
    name: 'Notes filed',
    body: 'Yesterday’s notes go where they belong, by a rule you can read.',
  },
  {
    time: '5:00',
    name: 'The sweep',
    body: 'He finds what drifted and fixes nothing. The questions wait for your button.',
  },
  {
    time: 'Overnight',
    name: 'Past-due invoices drafted',
    body: 'Anyone 30 days out gets a chase written and filed in your drafts. He never sends it himself.',
  },
  {
    time: '7 AM',
    name: 'The briefing',
    body: 'What happened, what’s on, what needs you. It’s there before you are.',
  },
] as const

export function WhileYouSleep() {
  return (
    <section id="while-you-sleep" className="bg-bg-primary py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="While you sleep"
          title="What’s already done when you wake up."
          sub="Five things, each on a clock."
        />

        <div className="mt-14 divide-y divide-slate-800/60 border-y border-slate-800/60 lg:mt-16">
          {overnight.map((job, i) => (
            <Reveal
              key={job.name}
              delay={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}
              className="flex flex-col gap-1.5 py-6 sm:flex-row sm:gap-8"
            >
              <span className="w-24 shrink-0 font-mono text-sm text-teal-400">{job.time}</span>
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-white sm:text-lg">{job.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{job.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
