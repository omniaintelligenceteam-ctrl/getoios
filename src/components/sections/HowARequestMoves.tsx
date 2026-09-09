import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

const steps = [
  {
    name: 'Say it',
    body: 'Out loud or typed, from your phone. One sentence is enough, and if it isn’t, he asks instead of guessing.',
  },
  {
    name: 'He works',
    body: 'He checks the record, not his memory. The last order, the real schedule, the actual ledger.',
  },
  {
    name: 'The read-back',
    body: 'If it can’t be undone, he stops and reads it back: the item, the total, where it’s going, the card by its last four.',
  },
  {
    name: 'Your yes',
    body: 'Yes fires it. No cancels it. “Make it 150 instead” sends it back through the whole thing, fresh read-back included.',
  },
  {
    name: 'The receipt',
    body: 'What he did, when, and what you told him. It’s in the log before you’ve put the phone down.',
  },
] as const

export function HowARequestMoves() {
  return (
    <section id="how-a-request-moves" className="bg-bg-secondary py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How a request moves"
          title="Say it. He works. You get the receipt."
          sub="Every request takes the same road. The only fork is whether it can be undone."
        />

        <ol className="mt-14 lg:mt-16">
          {steps.map((step, i) => (
            <Reveal
              as="li"
              key={step.name}
              delay={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}
              className="relative flex gap-5 pb-9 last:pb-0 sm:gap-7"
            >
              {/* Connector rail */}
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[19px] top-11 bottom-0 w-px bg-gradient-to-b from-teal-400/30 to-transparent sm:left-[23px]"
                />
              )}

              <span
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-mono text-sm sm:h-12 sm:w-12 ${
                  i === 2
                    ? 'border-teal-400/60 bg-teal-400/10 text-teal-300'
                    : 'border-slate-700/60 bg-slate-900 text-slate-400'
                }`}
              >
                {i + 1}
              </span>

              <div className="min-w-0 pt-1.5 sm:pt-2.5">
                <h3 className="text-lg font-semibold text-white sm:text-xl">{step.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400 sm:text-base">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
