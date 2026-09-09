import { JarvisOrb } from '@/components/ui/JarvisOrb'
import { Reveal } from '@/components/ui/Reveal'

const principles = [
  {
    name: 'He asks before he spends',
    body: 'Anything that can’t be undone stops and gets read back to you first. That rule is in the code, not in a prompt, and no setting lowers it.',
  },
  {
    name: 'You own what we build',
    body: 'Every tool, every integration, every note. Your memory is plain files in a folder that’s yours. Leave and it walks out with you.',
  },
  {
    name: 'No made-up numbers',
    body: 'You won’t find a counter on this site pretending to be live. When we have numbers worth showing, they’ll be real ones.',
  },
  {
    name: 'Month-to-month, on purpose',
    body: 'No long contract. We’d rather earn the next thirty days than hold you to a year of them.',
  },
] as const

export function AboutContent() {
  return (
    <section className="bg-bg-primary py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Wes's story */}
        <div className="mx-auto max-w-2xl">
          <Reveal as="p" className="text-lg leading-relaxed text-slate-300 sm:text-xl">
            I ran a landscape lighting company for ten years, across seven cities. What I needed the
            whole time was a COO: someone to chase the invoice I forgot about, keep the schedule
            straight, and tell me which team was double-booked before the customer did. I
            couldn&rsquo;t afford one, so I did it all myself, badly, at night.
          </Reveal>

          <Reveal as="p" delay={1} className="mt-6 text-lg leading-relaxed text-slate-300 sm:text-xl">
            Jarvis is what I built instead. He briefs me every morning, runs the parts of the day I
            used to lose sleep over, and reads back anything that costs money before he does it.
            OIOS installs him in businesses like the one I ran: working in yours by Day 7, and you
            own every piece of it.
          </Reveal>

          <Reveal delay={2} className="mt-8 flex items-center gap-4">
            <span className="h-px w-10 bg-teal-400/50" />
            <span className="font-mono text-xs uppercase tracking-[0.16em] text-slate-500">
              Wes Overstreet &middot; Founder, OIOS
            </span>
          </Reveal>
        </div>

        {/* Jarvis */}
        <Reveal delay={3} className="mt-16 flex justify-center lg:mt-20">
          <JarvisOrb size={220} />
        </Reveal>

        {/* Principles */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:mt-20">
          {principles.map((principle, i) => (
            <Reveal
              key={principle.name}
              delay={((i % 4) + 1) as 1 | 2 | 3 | 4}
              className="glass-card p-6"
            >
              <h2 className="text-base font-semibold text-white sm:text-lg">{principle.name}</h2>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-400">{principle.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
