'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus } from 'lucide-react'

const faqs = [
  {
    q: 'Is this just a chatbot?',
    a: 'A chatbot answers your questions. Jarvis keeps the schedule, writes the chase, builds the order and reads you the total before he pays for anything. He’s installed in your business, on your rules and your tools, and he does the work.',
  },
  {
    q: 'What can’t he do without asking me?',
    a: 'Anything that can’t be undone: sending money, paying a bill, cancelling a job, deleting a record, placing an order. He stops, reads it back — the item, the total, where it’s going, the card by its last four — and waits for your yes. That floor is in the code, and no setting lowers it.',
  },
  {
    q: 'Does he do things I didn’t ask for?',
    a: 'A few things, on a schedule, and you hear about it after: a chase drafted for anyone 30 days past due, notes filed overnight, a question about something he couldn’t sort. There’s a hard cap per day, each one reverses in a step, and “turn off autonomy” switches all of it off.',
  },
  {
    q: 'Where does my data live, and who owns it?',
    a: 'You do. Your notes are plain files in a folder that’s yours, your tools are yours, and if you leave it all walks with you. Card numbers show as last four only, in what he says and in the log.',
  },
  {
    q: 'How long does setup take?',
    a: 'Installed in the first few days, first build live by Day 7. That’s Month 1, and you pick the build on the first call.',
  },
  {
    q: 'Do I need to change my phone number?',
    a: 'No. Your number stays yours, and the receptionist answers what you don’t get to.',
  },
  {
    q: 'What if my team doesn’t like it?',
    a: 'He takes the jobs nobody on your team wanted: the past-due chase, the “did anyone confirm Thursday” text, the notes nobody files. Everything else stays with the people doing it now. If something rubs wrong, say so on the monthly call, or sooner, and we change it.',
  },
  {
    q: 'What happens when he gets something wrong?',
    a: 'You’ll see it, because everything he does is in the log. Say “stop” and he stops; anything he did on his own reverses in one step, and anything that mattered never fired without your yes. Then we change the rule so it doesn’t happen twice.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Month-to-month, no long contract, and you keep every tool, integration and note we built.',
  },
  {
    q: 'What types of businesses do you work with?',
    a: 'Small businesses, roughly 5 to 50 people, where the owner still answers the phone at dinner. If a workflow repeats, Jarvis can take it; the first call is where we pick which one goes first.',
  },
]

function FAQItem({
  faq,
  index,
  openIndex,
  setOpenIndex,
}: {
  faq: { q: string; a: string }
  index: number
  openIndex: number | null
  setOpenIndex: (i: number | null) => void
}) {
  const isOpen = openIndex === index

  return (
    <div className={`reveal reveal-d${(index % 5) + 1}`}>
      <button
        onClick={() => setOpenIndex(isOpen ? null : index)}
        className="glass-card flex w-full items-start justify-between gap-4 p-6 text-left transition-colors duration-300 hover:border-teal-400/20"
        aria-expanded={isOpen}
      >
        <h3 className="text-base font-semibold leading-snug text-slate-100 md:text-lg">{faq.q}</h3>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="mt-0.5 flex-shrink-0 text-teal-400"
        >
          <Plus className="h-5 w-5" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-0 text-sm leading-relaxed text-slate-400 md:text-base">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="bg-bg-primary py-20 lg:py-28">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="reveal">
            <span className="inline-flex items-center rounded-full border border-slate-700/40 bg-slate-800/40 px-3 py-1.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400">
                FAQ
              </span>
            </span>
          </div>

          <h2
            className="reveal reveal-d1 mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            The things you&rsquo;re wondering.
          </h2>
        </div>

        <div className="mx-auto mt-14 max-w-3xl space-y-3 lg:mt-16">
          {faqs.map((faq, i) => (
            <FAQItem
              key={faq.q}
              faq={faq}
              index={i}
              openIndex={openIndex}
              setOpenIndex={setOpenIndex}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
