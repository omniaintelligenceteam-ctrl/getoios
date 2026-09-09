import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

const included = [
  {
    name: 'The install',
    body: 'Days 1 to 3. Jarvis set up on your rules, your prices, your tone and your tools. You talk, we type.',
  },
  {
    name: 'Your first build, live',
    body: 'By Day 7. One thing you’ve been meaning to fix, running in your business. You pick it on the first call.',
  },
  {
    name: 'Everything already running',
    body: 'The 7 AM briefing, the schedule, the drafts, the nightly sweep and the log. From the install onward.',
  },
  {
    name: 'A human who knows your business',
    body: 'Not a ticket queue. One monthly call, thirty to sixty minutes, where you pick what gets built next.',
  },
] as const

const scope = [
  {
    name: 'What changes the quote',
    body: 'How many tools we’re connecting, how much of your day Jarvis takes, and how big the builds are. Every engagement is scoped and quoted on its own.',
  },
  {
    name: 'What doesn’t',
    body: 'No setup fee dressed up as onboarding, no per-seat creep, no charge to get your own data out. You own what we build from the first day.',
  },
  {
    name: 'What you’re comparing it to',
    body: 'The developer, the receptionist, the bookkeeper, the marketing agency and the office manager you were going to hire one at a time. That’s the number to hold it against.',
  },
  {
    name: 'How you leave',
    body: 'Month-to-month. Tell us and it stops. Every tool, integration and note walks out with you.',
  },
] as const

export function WhatToExpect() {
  return (
    <section id="month-1" className="bg-bg-primary py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Month 1"
          title="What’s in the first thirty days."
          sub="The install is the audit. By the end of week one there’s a real thing running in your business, not a slide deck."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16">
          {included.map((item, i) => (
            <Reveal
              key={item.name}
              delay={((i % 4) + 1) as 1 | 2 | 3 | 4}
              className="glass-card p-6 lg:p-7"
            >
              <h3 className="text-base font-semibold text-white sm:text-lg">{item.name}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{item.body}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 lg:mt-28">
          <SectionHeading
            eyebrow="Scope"
            title="Quoted against the hires you’ll never make."
            sub="Every engagement is custom, so the number comes off the first call, not off a page. Here’s what moves it."
          />

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16">
            {scope.map((item, i) => (
              <Reveal
                key={item.name}
                delay={((i % 4) + 1) as 1 | 2 | 3 | 4}
                className="glass-card p-6 lg:p-7"
              >
                <h3 className="text-base font-semibold text-white sm:text-lg">{item.name}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
