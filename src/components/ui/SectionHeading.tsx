import { Reveal } from '@/components/ui/Reveal'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  sub?: string
  className?: string
}

export function SectionHeading({ eyebrow, title, sub, className = '' }: SectionHeadingProps) {
  return (
    <div className={`mx-auto max-w-2xl text-center ${className}`}>
      <Reveal>
        <span className="inline-flex items-center rounded-full border border-slate-700/40 bg-slate-800/40 px-3 py-1.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-slate-400">
            {eyebrow}
          </span>
        </span>
      </Reveal>

      <h2
        className="reveal reveal-d1 mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
        style={{ fontFamily: 'var(--font-display), sans-serif' }}
      >
        {title}
      </h2>

      {sub && (
        <Reveal as="p" delay={2} className="mt-5 text-base leading-relaxed text-slate-400 sm:text-lg">
          {sub}
        </Reveal>
      )}
    </div>
  )
}
