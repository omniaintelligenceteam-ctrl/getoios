import { ArrowRight, Check, Link2, MessageSquare, Rocket } from 'lucide-react'

const milestones = [
  {
    title: 'Choose the first handoff',
    timing: 'Start of Month 1',
    description: 'Together, we pick the first job for Jarvis: the request coming in, the result you need, and the point where you want to review it.',
    result: 'One agreed first build, with a clear finish.',
    icon: MessageSquare,
  },
  {
    title: 'Connect the agreed tools',
    timing: 'During the install',
    description: 'We set up your workspace and the connections in your scope. Your rules, prices, tone, and access permissions shape how Jarvis works.',
    result: 'Your tools and your rules, in one working setup.',
    icon: Link2,
  },
  {
    title: 'Review the working result',
    timing: 'Before the first build goes live',
    description: 'You check the first result against the way your business works. We tune the handoff and make clear what Jarvis prepares and what needs your approval.',
    result: 'A result you can inspect, with customer sends under your control.',
    icon: Check,
  },
  {
    title: 'Put the first build to work',
    timing: 'First build live by Day 7',
    description: 'Month 1 is the install. After that: one meeting a month, one big build or two small ones. Everything already built keeps running while the next thing ships.',
    result: 'Build. Run. Ship. A monthly rhythm that compounds.',
    icon: Rocket,
  },
]

export function HowItWorksNew() {
  return (
    <section id="how-it-works" aria-labelledby="install-heading" className="py-24 lg:py-32 bg-bg-secondary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-teal-300">Month 1 · The install</span>
            <h2 id="install-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mt-5" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
              Your first handoff.<br /><span className="gradient-text">Built to work.</span>
            </h2>
            <p className="mt-6 text-slate-300 leading-relaxed">Here is what happens between our first conversation and the first build working in your business.</p>
            <div className="mt-8 rounded-2xl border border-teal-400/20 bg-teal-400/5 p-5">
              <p className="text-white font-semibold">You stay in control.</p>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">Jarvis prepares the work. Nothing reaches a customer without your say-so.</p>
            </div>
          </div>
          <ol aria-label="Installation milestones" className="space-y-0">
            {milestones.map(({ title, timing, description, result, icon: Icon }, i) => (
              <li key={title} className="relative flex gap-4 sm:gap-6 pb-10 last:pb-0">
                {i < milestones.length - 1 && <span aria-hidden="true" className="absolute left-[21px] top-12 bottom-0 border-l border-dashed border-slate-600" />}
                <span aria-hidden="true" className="relative flex-shrink-0 flex w-11 h-11 items-center justify-center rounded-full border border-teal-400/30 bg-slate-900 text-teal-300 text-sm font-mono">0{i + 1}</span>
                <div className="min-w-0 pt-1">
                  <p className="text-xs font-mono text-teal-300 mb-2">{timing}</p>
                  <h3 className="text-xl text-white font-semibold flex items-center gap-3">{title}<Icon aria-hidden="true" className="hidden sm:block w-5 h-5 text-slate-400 flex-shrink-0" /></h3>
                  <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">{description}</p>
                  <p className="mt-3 text-sm text-slate-400 flex gap-2"><ArrowRight aria-hidden="true" className="w-4 h-4 flex-shrink-0 mt-0.5" />{result}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
