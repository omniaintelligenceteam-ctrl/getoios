import { JarvisOrb } from '@/components/ui/JarvisOrb'
import { Reveal } from '@/components/ui/Reveal'

const facts = [
  {
    name: 'Memory you own',
    body: 'Every note is a plain text file in a folder that’s yours. Leave, and it walks out with you.',
  },
  {
    name: 'The nightly sweep',
    body: 'Every night he tidies: files notes by type, flags what looks stale or doubled. He fixes nothing on his own; he shows you.',
  },
  {
    name: 'The review queue',
    body: 'Anything he isn’t sure about goes on a short list. You answer with a button, or ignore it. Nothing changes until you do.',
  },
  {
    name: 'Nothing invented',
    body: 'If it isn’t in your schedule, your ledger or your notes, he doesn’t act on it. A guess is not a fact.',
  },
] as const

export function KnowsYourBusiness() {
  return (
    <section id="he-knows-your-business" className="bg-bg-secondary py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: the face */}
          <Reveal className="flex justify-center lg:justify-start">
            <JarvisOrb size={300} className="sm:!h-[340px] sm:!w-[340px]" />
          </Reveal>

          {/* Right: the copy */}
          <div>
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-slate-700/40 bg-slate-800/40 px-3 py-1.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400">
                  He knows your business
                </span>
              </span>
            </Reveal>

            <h2
              className="reveal reveal-d1 mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}
            >
              He remembers what you told him. In files you own.
            </h2>

            <Reveal as="p" delay={2} className="mt-5 text-base leading-relaxed text-slate-400">
              Your prices, your rules, your customers&rsquo; quirks. Written down in plain notes you
              can open, edit or take with you.
            </Reveal>

            <dl className="mt-10 space-y-6">
              {facts.map((fact, i) => (
                <Reveal
                  as="div"
                  key={fact.name}
                  delay={((i % 4) + 1) as 1 | 2 | 3 | 4}
                  className="border-l-2 border-teal-400/25 pl-5"
                >
                  <dt className="text-base font-semibold text-white">{fact.name}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-slate-400">{fact.body}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
