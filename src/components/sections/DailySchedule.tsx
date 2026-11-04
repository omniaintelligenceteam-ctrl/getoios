'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowRight, FileText, MessageSquare, ShieldCheck } from 'lucide-react'

const steps = [
  {
    name: 'The request',
    title: 'Start with the work in front of you',
    description: 'A customer needs a quote. You bring the job details and ask Jarvis to prepare a draft using the prices you have supplied.',
    detail: 'Two hours of preparation, one materials kit, and a custom repair. The repair still needs a price.',
    icon: MessageSquare,
  },
  {
    name: 'The prepared draft',
    title: 'Known prices stay separate from missing details',
    description: 'The website example adds the supplied prices: two hours at $95 and a $120 kit. The priced subtotal is $310. The custom repair remains unpriced.',
    detail: 'A subtotal is not a complete quote. Missing information stays visible for the owner to resolve.',
    icon: FileText,
  },
  {
    name: 'Your decision',
    title: 'Edit, approve, or leave it unsent',
    description: 'Review the priced lines, supply the missing repair price, and decide what the customer should receive. This example does not send a quote or connect to a customer account.',
    detail: 'Your next move: resolve the missing price before approving a complete quote.',
    icon: ShieldCheck,
  },
]

export function DailySchedule() {
  const [selected, setSelected] = useState(0)
  const step = steps[selected]
  const Icon = step.icon

  return (
    <section id="daily-schedule" aria-labelledby="workflow-heading" className="py-24 lg:py-32 bg-bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-teal-300">One workflow · Sample quote</span>
          <h2 id="workflow-heading" className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-display), sans-serif' }}>One request, from draft to your decision</h2>
          <p className="mt-5 text-slate-300 leading-relaxed">A concrete example of the handoff: Jarvis prepares the work, shows what is missing, and leaves the decision with you.</p>
        </div>
        <p className="rounded-xl border border-teal-400/25 bg-teal-400/5 p-5 text-teal-200 font-medium mb-8">Nothing reaches a customer without your approval.</p>
        <div className="hidden lg:grid grid-cols-[0.85fr_1.15fr] gap-8">
          <div className="space-y-3" aria-label="Choose a workflow step">
            {steps.map((item, i) => (
              <button key={item.name} type="button" onClick={() => setSelected(i)} aria-pressed={selected === i} aria-controls="workflow-detail" className={`w-full min-h-20 rounded-xl border p-5 text-left flex items-center gap-4 transition-colors focus-visible:outline-2 focus-visible:outline-teal-300 focus-visible:outline-offset-4 ${selected === i ? 'border-teal-400/50 bg-teal-400/10 text-white' : 'border-slate-700/60 bg-slate-900/40 text-slate-300 hover:border-slate-500'}`}>
                <span aria-hidden="true" className="font-mono text-teal-300 text-sm">0{i + 1}</span>
                <span className="font-semibold flex-1">{item.name}</span>
                <ArrowRight aria-hidden="true" className="w-5 h-5" />
              </button>
            ))}
          </div>
          <div id="workflow-detail" role="region" aria-label="Selected workflow step" aria-live="polite" className="glass-card p-8 flex flex-col justify-center">
            <Icon aria-hidden="true" className="text-teal-300 w-8 h-8 mb-6" />
            <h3 className="text-2xl font-semibold text-white">{step.title}</h3>
            <p className="mt-4 text-slate-300 leading-relaxed">{step.description}</p>
            <p className="mt-6 pt-5 border-t border-slate-700 text-sm text-teal-200 leading-relaxed">{step.detail}</p>
          </div>
        </div>
        <ol aria-label="Sample quote workflow" className="lg:hidden space-y-4">
          {steps.map((item, i) => (
            <li key={item.name} className="glass-card p-5 sm:p-6">
              <p className="text-xs text-teal-300 font-mono mb-3">0{i + 1} · {item.name}</p>
              <h3 className="text-xl text-white font-semibold">{item.title}</h3>
              <p className="mt-3 text-slate-300 text-sm leading-relaxed">{item.description}</p>
              <p className="mt-4 border-t border-slate-700 pt-4 text-sm text-teal-200 leading-relaxed">{item.detail}</p>
            </li>
          ))}
        </ol>
        <figure className="mt-8 grid md:grid-cols-[1fr_0.8fr] gap-6 items-center rounded-2xl border border-slate-700 p-5 sm:p-6 bg-slate-900/40">
          <Image src="/jarvis/assets/proof/jarvis-workflow-poster.png" alt="Meet Jarvis website example showing the $310 priced subtotal and the custom repair marked Price needed." width={960} height={1000} className="w-full max-h-[400px] object-contain rounded-lg bg-[#faf8ff]" />
          <figcaption>
            <p className="text-xs font-mono text-teal-300 uppercase tracking-widest">The sample on screen</p>
            <p className="mt-3 text-xl font-semibold text-white">The missing price stays in view.</p>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">This is the actual Meet Jarvis website example. Review the priced lines or keep the example as a draft; neither action sends anything.</p>
          </figcaption>
        </figure>
        <p className="mt-6 text-sm text-slate-400 leading-relaxed">Illustrative website example with sample job data, not a connected Jarvis session. The sample job prices are not OIOS service prices.</p>
        <a href="/how-it-works#watch" className="inline-flex items-center gap-2 min-h-11 mt-3 text-teal-300 font-medium hover:text-teal-200">Watch the sample handoff <ArrowRight aria-hidden="true" className="w-4 h-4" /></a>
      </div>
    </section>
  )
}
