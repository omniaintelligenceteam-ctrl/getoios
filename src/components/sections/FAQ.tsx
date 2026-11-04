import { Plus } from 'lucide-react'

const generalFaqs = [
  {
    q: 'Is my business data secure?',
    a: 'Yes. All data is encrypted in transit and at rest. We use enterprise-grade infrastructure with SOC 2 compliant providers. Your business data is never shared with third parties or used to train AI models.',
  },
  {
    q: 'How long does setup take?',
    a: 'Your first build is live by Day 7. Month 1 is the install: we set up your AI Operating System, connect your tools, and ship one custom build that works in your business — not a demo. After that, the rhythm is one meeting a month, one big build (or two small ones), and everything already built keeps running every day.',
  },
  {
    q: 'What if my team doesn\u2019t like it?',
    a: 'OIOS handles the admin work your team already doesn\u2019t want to do \u2014 drafting customer replies, updating the CRM, preparing follow-ups for your approval. Your team focuses on the skilled work they were hired for.',
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
    q: 'What types of businesses do you work with?',
    a: 'Any small business that has a phone and customers. We work with service companies, insurance agencies, dental practices, real estate offices, restaurants, consulting firms, and more. If you have calls to answer and a back office to run, OIOS can help.',
  },
]

const scopeFaqs = [
  { q: "Why don't you list prices publicly?", a: "Every stack is custom — your rules, your tools, your workflows. We quote against what you'd spend hiring for the same work (an office manager, a bookkeeper, a dev shop), not against a menu. Book a call and we'll scope it with you." },
  { q: 'What happens in Month 1?', a: "The install. We set up your AI Operating System, connect your tools, and ship your first custom build live by Day 7. Then the monthly rhythm starts: one meeting, one big build, everything else keeps running." },
  { q: 'Can I change bands later?', a: 'Yes. The bands describe scope, not a cage. As your business grows, the build cadence and coverage grow with it — changes take effect the next month.' },
]
const contractFaq = { q: 'Is there a contract?', a: 'No. Month-to-month, cancel anytime, no fees. And you own everything we build — if you leave, every tool, integration, and piece of data walks with you.' }
const groups = [
  { name: 'Scope & setup', questions: [...scopeFaqs, generalFaqs[1], generalFaqs[4], generalFaqs[6]] },
  { name: 'Your team & control', questions: [generalFaqs[2], generalFaqs[5], generalFaqs[0]] },
  { name: 'Ownership & cancellation', questions: [contractFaq, generalFaqs[3]] },
]

export function FAQ() {
  return (
    <section aria-labelledby="faq-heading" className="py-24 lg:py-32 bg-bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-teal-300">FAQ</span>
          <h2 id="faq-heading" className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold text-white" style={{ fontFamily: 'var(--font-display), sans-serif' }}>Questions before you start</h2>
          <p className="mt-5 text-slate-300">The scope, the setup, and what stays yours.</p>
        </div>
        <div className="space-y-12">
          {groups.map(group => (
            <div key={group.name} className="grid lg:grid-cols-[0.7fr_1.3fr] gap-5 lg:gap-12">
              <h3 className="text-lg font-semibold text-teal-300 pt-4">{group.name}</h3>
              <div className="space-y-3">
                {group.questions.map(faq => (
                  <details key={faq.q} className="group glass-card overflow-hidden">
                    <summary className="min-h-14 cursor-pointer list-none flex items-center justify-between gap-4 p-5 text-white font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-300 focus-visible:-outline-offset-4 [&::-webkit-details-marker]:hidden">
                      <span>{faq.q}</span><Plus aria-hidden="true" className="w-5 h-5 flex-shrink-0 text-teal-300 group-open:rotate-45" />
                    </summary>
                    <p className="px-5 pb-5 text-sm sm:text-base text-slate-300 leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
