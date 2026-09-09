import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

const steps = [
  {
    marker: 'Days 1–3',
    name: 'The install',
    body: 'We set Jarvis up on your rules, your prices, your tone, your tools. You talk, we type. You’ll never write a prompt.',
  },
  {
    marker: 'Day 7',
    name: 'First build live',
    body: 'One thing you’ve been meaning to fix, built and running. You pick it on the first call.',
  },
  {
    marker: 'Month 2+',
    name: 'Then one meeting a month',
    body: 'Thirty to sixty minutes. Look at the last 30 days, pick the next build. One big one, or two small ones.',
  },
  {
    marker: 'Always',
    name: 'Month-to-month. You own it all.',
    body: 'Every tool, every integration, every note. Stay because it’s working, not because you signed something.',
  },
] as const

export function MonthOne() {
  return (
    <section id="month-one" className="bg-bg-secondary py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Month 1"
          title="Installed, and your first build live by Day 7."
          sub="The install is the audit. By the end of week one there’s a real thing running in your business, not a slide deck."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal
              key={step.name}
              delay={((i % 4) + 1) as 1 | 2 | 3 | 4}
              className="glass-card flex flex-col p-6"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-teal-400">
                {step.marker}
              </span>
              <h3 className="mt-3 text-lg font-semibold leading-snug text-white">{step.name}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{step.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={5} className="mt-10 text-center">
          <Link
            href="/form"
            data-glow
            data-cursor="cta"
            className="btn-glow inline-flex items-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-8 py-3.5 font-semibold text-white transition-all duration-200 hover:from-amber-600 hover:to-amber-500"
          >
            Start Month 1
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
