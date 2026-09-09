import {
  Brain,
  CalendarCheck,
  Globe,
  Hammer,
  Megaphone,
  PhoneCall,
  Receipt,
  Sunrise,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { SectionHeading } from '@/components/ui/SectionHeading'

/**
 * Eight things an owner hands Jarvis in the first month.
 *
 * Every tag is load-bearing: it says whether the thing fires on its own, runs
 * quietly on a schedule, or stops for a yes. Nothing on this list is a claim
 * the product can't back — the phones strip below is deliberately marked as
 * something OIOS installs, not something you say to Jarvis.
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

const groups: {
  icon: LucideIcon
  name: string
  promise: string
  ask: string
  tag: Tag
  note?: string
}[] = [
  {
    icon: CalendarCheck,
    name: 'Scheduling',
    promise: 'Booked on the call. Confirmed by text. Reminded the day before.',
    ask: 'Put her in Thursday’s first open slot and text her the confirmation.',
    tag: 'asks',
    note: 'for the text',
  },
  {
    icon: TrendingUp,
    name: 'Sales',
    promise: 'No lead falls through the cracks. Ever.',
    ask: 'Draft a quote for the Miller job at our usual rate.',
    tag: 'quiet',
    note: 'it leaves when you say so',
  },
  {
    icon: Megaphone,
    name: 'Marketing',
    promise: 'The stuff you know you should do but never have time for.',
    ask: 'Write review requests for everyone we finished with this week.',
    tag: 'asks',
  },
  {
    icon: Sunrise,
    name: 'Operations',
    promise: 'Wake up to a briefing. Not a mess.',
    ask: 'Skip the patterns section and lead with anything that needs me today.',
    tag: 'quiet',
  },
  {
    icon: Receipt,
    name: 'Finance',
    promise:
      'No more awkward past-due calls. He writes the chase and puts it in your drafts. You say send.',
    ask: 'Chase anyone who’s 30 days out.',
    tag: 'asks',
  },
  {
    icon: Hammer,
    name: 'Build',
    promise: 'Say what you need. See it working before it goes live.',
    ask: 'Build me a page where customers can check where their job is.',
    tag: 'asks',
  },
  {
    icon: Brain,
    name: 'Second brain',
    promise: 'Say it once. He keeps it, in plain files you own.',
    ask: 'Remember: the Hendersons want texts, never calls, and nothing before 8.',
    tag: 'does',
  },
  {
    icon: Globe,
    name: 'Your website and your tools',
    promise:
      'He reads the sites you use, fills the forms, builds the cart, and stops at the money.',
    ask: 'Reorder the gloves from the usual supplier.',
    tag: 'asks',
  },
]

export function SayItToJarvis() {
  return (
    <section id="what-you-can-say" className="bg-bg-primary py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="What you can say to Jarvis"
          title="Talk to him like you’d talk to a good office manager."
          sub="Eight things owners hand him in the first month. Each card says whether he does it, does it quietly, or asks first. The routine ones run on rules you set with us on Day 1."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {groups.map((group, i) => {
            const Icon = group.icon
            return (
              <Reveal
                key={group.name}
                delay={((i % 4) + 1) as 1 | 2 | 3 | 4}
                className="glass-card flex flex-col p-6"
              >
                <Icon className="h-6 w-6 text-teal-400" aria-hidden="true" />

                <h3 className="mt-4 text-lg font-semibold leading-snug text-white">
                  {group.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{group.promise}</p>

                <p className="mt-5 border-l-2 border-teal-400/30 pl-3 text-sm italic leading-relaxed text-slate-300">
                  &ldquo;{group.ask}&rdquo;
                </p>

                <div className="mt-auto pt-5">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${tagClass[group.tag]}`}
                  >
                    {tagLabel[group.tag]}
                  </span>
                  {group.note && (
                    <span className="mt-1.5 block text-[11px] leading-snug text-slate-500">
                      {group.note}
                    </span>
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>

        {/* Phones are an OIOS install, not something you say to Jarvis. */}
        <Reveal delay={5} className="mt-6">
          <div className="glass flex flex-col gap-3 rounded-2xl border border-slate-700/40 p-6 sm:flex-row sm:items-center sm:gap-5">
            <PhoneCall className="h-6 w-6 shrink-0 text-amber-400" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-amber-400">
                  Also in the install &middot;{' '}
                </span>
                Every call answered. Every caller remembered.
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                A receptionist who picks up when you can&rsquo;t, books the job, and leaves Jarvis
                the notes.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
