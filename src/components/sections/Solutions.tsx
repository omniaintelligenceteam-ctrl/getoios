import { Reveal } from '@/components/ui/Reveal'

/**
 * Thirteen sentences an owner actually says. Every one of them maps to
 * something live: nothing here rests on the phone bridge, on texting Jarvis,
 * or on an overnight sweep that ships switched off.
 */
type Tag = 'does' | 'quiet' | 'asks'

const tagLabel: Record<Tag, string> = {
  does: 'Does it',
  quiet: 'Does it quietly',
  asks: 'Asks first',
}

const tagClass: Record<Tag, string> = {
  does: 'border-teal-400/30 bg-teal-400/10 text-teal-300',
  quiet: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
  asks: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
}

const asks: { group: string; ask: string; result: string; tag: Tag }[] = [
  {
    group: 'Scheduling',
    ask: 'Put her in Thursday’s first open slot and text her the confirmation.',
    result: 'Booked, and the confirmation waits on your yes before it goes.',
    tag: 'asks',
  },
  {
    group: 'Scheduling',
    ask: 'Move the Alvarez job to next Tuesday and tell them why.',
    result: 'The schedule changes; the message to the customer gets read back first.',
    tag: 'asks',
  },
  {
    group: 'Sales',
    ask: 'Draft a quote for the Miller job at our usual rate.',
    result: 'Written against your real prices and left in your drafts.',
    tag: 'quiet',
  },
  {
    group: 'Sales',
    ask: 'Who did we quote last month that never came back?',
    result: 'A list off the actual record, not a guess.',
    tag: 'does',
  },
  {
    group: 'Marketing',
    ask: 'Write review requests for everyone we finished with this week.',
    result: 'Drafted per customer. Nothing leaves until you say so.',
    tag: 'asks',
  },
  {
    group: 'Finance',
    ask: 'Chase anyone who’s 30 days out.',
    result: 'One chase per invoice, in your drafts. You send them.',
    tag: 'asks',
  },
  {
    group: 'Finance',
    ask: 'What’s outstanding right now, oldest first?',
    result: 'Straight from the ledger, in the order that matters.',
    tag: 'does',
  },
  {
    group: 'Operations',
    ask: 'Skip the patterns section and lead with anything that needs me today.',
    result: 'Tomorrow’s 7 AM briefing arrives in that shape, and stays that way.',
    tag: 'quiet',
  },
  {
    group: 'Second brain',
    ask: 'Remember: the Hendersons want texts, never calls, and nothing before 8.',
    result: 'Written to a plain file you own, and applied from then on.',
    tag: 'does',
  },
  {
    group: 'The log',
    ask: 'What did you do yesterday, and what did you ask me about?',
    result: 'Every action, every read-back, every yes and no.',
    tag: 'does',
  },
  {
    group: 'Build',
    ask: 'Build me a page where customers can check where their job is.',
    result: 'Built on a branch, shown to you working, live once you approve it.',
    tag: 'asks',
  },
  {
    group: 'Your tools',
    ask: 'Reorder the gloves from the usual supplier.',
    result: 'Cart built off the last order. He stops at the money and reads it back.',
    tag: 'asks',
  },
  {
    group: 'Control',
    ask: 'Turn off autonomy.',
    result: 'Everything he does on his own stops. No confirmation, settings kept.',
    tag: 'does',
  },
]

export function SolutionsContent() {
  return (
    <section className="bg-bg-primary py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {asks.map((item, i) => (
            <Reveal
              key={item.ask}
              delay={((i % 5) + 1) as 1 | 2 | 3 | 4 | 5}
              className="glass-card p-6 lg:p-7"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                  {item.group}
                </span>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${tagClass[item.tag]}`}
                >
                  {tagLabel[item.tag]}
                </span>
              </div>

              <p className="mt-3 text-lg font-semibold leading-snug text-white sm:text-xl">
                &ldquo;{item.ask}&rdquo;
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400 sm:text-base">
                {item.result}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
