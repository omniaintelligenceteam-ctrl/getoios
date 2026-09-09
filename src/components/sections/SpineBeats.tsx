import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

const beats = [
  {
    word: 'Briefed',
    body: '7 AM, what happened overnight and what’s on today. Read it with your coffee.',
  },
  {
    word: 'Handled',
    body: 'The schedule, the follow-ups, the past-due invoices. He does them, you don’t.',
  },
  {
    word: 'Your call',
    body: 'Anything that can’t be undone gets read back to you. Yes or no, and it’s done.',
  },
] as const

export function SpineBeats() {
  return (
    <section id="a-day-with-jarvis" className="bg-bg-primary py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Briefed. Handled. Your call."
          title="Here’s a day with Jarvis."
          sub="It’s the same day you have now. You just stop being the one holding all of it."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3 lg:mt-16">
          {beats.map((beat, i) => (
            <Reveal
              key={beat.word}
              delay={(i + 1) as 1 | 2 | 3}
              className="glass-card p-7 lg:p-8"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-teal-400">
                0{i + 1}
              </span>
              <h3
                className="mt-4 text-2xl font-bold text-white lg:text-3xl"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}
              >
                {beat.word}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400 lg:text-base">
                {beat.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
