import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

/**
 * The guardrail section. Every line here maps to something enforced in code at
 * the tool-call boundary, not to a prompt instruction — which is why it can be
 * stated this plainly. No numbers on the daily cap: it is configurable, and a
 * number on this page would be a claim we'd have to keep true forever.
 */
const rules = [
  {
    name: 'The red floor',
    body: 'Send money, pay a bill, cancel a job, delete a record, place an order: anything that can’t be undone stops and waits for you. Every time.',
  },
  {
    name: 'Last four only',
    body: 'He never says a full card number out loud and never writes one in the log. You hear “ending in 4471” and that’s all.',
  },
  {
    name: 'The log',
    body: 'Every request, every read-back, every yes and no, in one place you can open. “What did he do while I wasn’t looking” has an answer.',
  },
  {
    name: 'The stop word',
    body: 'Say “stop” and he stops what he’s doing in the conversation. There’s a button under your thumb for the same thing.',
  },
  {
    name: 'One sentence to switch off',
    body: '“Turn off autonomy” turns off everything he does on his own. No confirmation, and your settings are still there when you turn it back on.',
  },
  {
    name: 'A cap on surprises',
    body: 'There’s a hard limit on how many things he does unasked in a day, and each one reverses in a step.',
  },
] as const

export function AsksFirst() {
  return (
    <section id="he-asks-first" className="relative overflow-hidden bg-bg-primary py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 50% 0%, rgba(45,212,191,0.06) 0%, transparent 65%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="He asks first"
          title="Nothing that costs you fires without a yes."
          sub="That rule sits in the code, under everything else. No setting, no prompt and no bad day can lower it."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {rules.map((rule, i) => (
            <Reveal
              key={rule.name}
              delay={((i % 3) + 1) as 1 | 2 | 3}
              className="glass-card p-6"
            >
              <h3 className="text-base font-semibold text-white sm:text-lg">{rule.name}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{rule.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
