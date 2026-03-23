'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useInView } from 'motion/react'
import { useRef } from 'react'
import { Plus } from 'lucide-react'

const faqs = [
  {
    q: 'Is my business data secure?',
    a: 'Yes. All data is encrypted in transit and at rest. We use enterprise-grade infrastructure with SOC 2 compliant providers. Your business data is never shared with third parties or used to train AI models.',
  },
  {
    q: 'How long does setup take?',
    a: 'Most businesses are up and running within 24 hours. We connect to your phone system, email, and calendar \u2014 no software to install, no hardware to buy. Your AI team starts working on day one.',
  },
  {
    q: 'What if my team doesn\u2019t like it?',
    a: 'OIOS handles the admin work your team already doesn\u2019t want to do \u2014 answering after-hours calls, updating the CRM, sending follow-ups. Your team focuses on the skilled work they were hired for.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Absolutely. No long-term contracts, no cancellation fees. We believe in earning your business every month. If OIOS isn\u2019t delivering value, you can cancel with 30 days notice.',
  },
  {
    q: 'Do I need to change my phone number?',
    a: 'No. OIOS works with your existing business phone number through call forwarding. Your customers call the same number they always have \u2014 they just get a much better experience.',
  },
  {
    q: 'What happens if the AI gets something wrong?',
    a: 'Every AI interaction is logged and reviewable. You set the rules for how your AI team operates \u2014 what to say, when to escalate, which calls to transfer. You\u2019re always in control.',
  },
  {
    q: 'How is this different from Jobber or ServiceTitan?',
    a: 'Those are CRM tools that require your team to log in and operate them. OIOS is an AI team that operates autonomously \u2014 answering calls, following up on leads, tracking finances, and running marketing. It\u2019s the difference between a tool and an employee.',
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
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <button
        onClick={() => setOpenIndex(isOpen ? null : index)}
        className="glass-card w-full text-left p-6 flex items-start justify-between gap-4 transition-colors duration-300 hover:border-teal-400/20"
        aria-expanded={isOpen}
      >
        <h3 className="text-base md:text-lg font-semibold text-slate-100 leading-snug">
          {faq.q}
        </h3>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="mt-0.5 flex-shrink-0 text-teal-400"
        >
          <Plus className="w-5 h-5" />
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
            <div className="px-6 pb-6 pt-0 text-slate-400 leading-relaxed text-sm md:text-base">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const headingInView = useInView(headingRef, { once: true, margin: '-100px' })

  return (
    <section className="py-24 lg:py-32 bg-bg-primary">
      <div className="container mx-auto px-6">
        <div ref={headingRef} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-800/40 border border-slate-700/30 mb-6">
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-400">
                FAQ
              </span>
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            Questions? <span className="gradient-text">We&apos;ve Got Answers</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-base md:text-lg max-w-xl mx-auto"
          >
            Everything contractors ask before they sign up.
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
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
