'use client'

import Image from 'next/image'
import { motion, useInView } from 'motion/react'
import { useRef } from 'react'

// ─── The three pillars ───────────────────────────────────────────────────────
// The same three the front door (public/jarvis) and meetjarvis.getoios.com
// show: the assistant you talk to, the back office behind the work, and the
// workflows that keep going while you are away. The pictures are the front
// door's (public/jarvis/assets/pillars). No invented figures here: no
// counters, no percentages, no seconds.

interface PillarData {
  number: string
  subtitle: string
  title: string
  time: string
  tagline: string
  description: string
  bullets: string[]
  before: string
  after: string
  accent: string
  picture: { src: string; alt: string }
  start: { href: string; label: string }
  flip?: boolean
}

const PILLARS: PillarData[] = [
  {
    number: '01',
    subtitle: 'Pillar One',
    title: 'Assistant',
    time: '7:40 am',
    tagline: 'Your chief of staff, by voice.',
    description:
      'Talk to him like a person, from the counter, the car or the office. He knows what needs you before the day starts, reads your thought back sharper, and keeps one thing at a time.',
    bullets: [
      'Phone, web or iPhone, hands-free in the car',
      'Knows what needs you before the day starts',
      'Reads your thought back sharper, pushes back, keeps one thing at a time',
      'Remembers everything you have told him and every past conversation',
      'Promise ledger: what you owe, what you are owed, what is slipping',
      'Calendar, reminders and your to-do board, by voice',
      'Research on competitors, prices and suppliers, with sources',
    ],
    before: 'You are opening up, three things are due before nine, and the only list is in your head.',
    after:
      'You ask him from the car. He names the three things, drafts the one that needs a reply, and keeps the rest on the board.',
    accent: 'text-teal-400',
    picture: {
      src: '/jarvis/assets/pillars/assistant-1200.jpg',
      alt: 'A café ten minutes before opening: the owner wipes down the espresso machine, a phone propped on the register, chairs still up on the tables.',
    },
    start: { href: '/?pillar=assistant#start', label: 'Start with the assistant' },
  },
  {
    number: '02',
    subtitle: 'Pillar Two',
    title: 'Back Office',
    time: '2:10 pm',
    tagline: 'The operation behind the work.',
    description:
      'From the first customer conversation to the job, the paperwork and the money. He drafts, you approve, and nothing is sent to a customer without your tap.',
    bullets: [
      'Sorts every incoming call, text and email: answer, draft, escalate or ignore',
      'Talk the job or the order through and snap a few photos; he turns that into a priced quote draft from your prices',
      'Names every line he could not price instead of guessing',
      'Converts an approved quote to an invoice with a pay-by-card link',
      'Drafts customer replies in your voice for you to approve',
      'Puts jobs and shifts on the board against who is actually free, writes team messages readable on a phone',
      'Agreements, onboarding packets and permit applications, prepared, never filed',
    ],
    before: 'You are doing the work and the paperwork. The quote waits until tonight, and tonight has its own list.',
    after:
      'You talk the job through. He drafts the quote from your prices, names what he could not price, and the invoice follows your approval.',
    accent: 'text-amber-400',
    picture: {
      src: '/jarvis/assets/pillars/back-office-1200.jpg',
      alt: 'A dental clinic front desk in the afternoon: the receptionist on the phone, an invoice, the appointment book and a laptop on the desk.',
    },
    start: { href: '/?pillar=back-office#start', label: 'Start with the back office' },
    flip: true,
  },
  {
    number: '03',
    subtitle: 'Pillar Three',
    title: 'Workflows',
    time: '9:00 pm',
    tagline: 'The follow-through that keeps going.',
    description:
      'Recurring work, prepared replies and repeatable errands. You set the rhythm and keep the decisions that need your approval.',
    bullets: [
      'A morning brief to open the day, a closing sweep to end it',
      'Holds the fort while you are away, and wakes you only for money, a broken promise or a fire',
      'Chases quiet quotes and overdue invoices on a schedule you set; he drafts, you tap send',
      'Web errands in a real browser: portals, forms, uploads, downloads',
      'Coming: review requests after good jobs, email campaigns to past customers',
    ],
    before: 'Follow-ups happen when you remember them, which is after the customer went quiet.',
    after:
      'The morning brief opens the day, the closing sweep ends it, and quiet quotes get chased on the schedule you set. You tap send.',
    accent: 'text-cyan-400',
    picture: {
      src: '/jarvis/assets/pillars/workflows-1200.jpg',
      alt: "A housewares shop at closing: the owner turns the sign on the door, the day's receipts stacked by the till, keys and a phone on the counter.",
    },
    start: { href: '/?pillar=workflows#start', label: 'Start with workflows' },
  },
]

// ─── Before / After cards ────────────────────────────────────────────────────
function BeforeAfter({ before, after }: { before: string; after: string }) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-6">
      <div className="glass-card p-4 border-red-500/15">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-red-400/70 flex-shrink-0" />
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Before</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">{before}</p>
      </div>
      <div className="glass-card p-4 border-teal-400/15">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-teal-400/70 flex-shrink-0" />
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">After</span>
        </div>
        <p className="text-xs text-white leading-relaxed">{after}</p>
      </div>
    </div>
  )
}

// ─── Single pillar block ─────────────────────────────────────────────────────
function Pillar({ pillar }: { pillar: PillarData }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const { number, subtitle, title, time, tagline, description, bullets, before, after, accent, picture, start, flip } = pillar

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
    >
      {/* Text */}
      <div className={flip ? 'lg:order-2' : undefined}>
        <div className="flex items-baseline gap-3 mb-4">
          <span className={`text-5xl font-bold ${accent} opacity-30 font-mono`}>{number}</span>
          <div>
            <div className={`text-xs font-mono uppercase tracking-[0.2em] ${accent} mb-1`}>{subtitle}</div>
            <h3 className="text-2xl lg:text-3xl font-bold text-white">{title}</h3>
          </div>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed mb-5">{description}</p>
        <ul className="space-y-2">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-slate-300">
              <span className={`mt-2 w-1.5 h-1.5 rounded-full ${accent.replace('text-', 'bg-')} opacity-70 flex-shrink-0`} />
              {b}
            </li>
          ))}
        </ul>
        <BeforeAfter before={before} after={after} />
        <a
          href={start.href}
          className={`inline-flex items-center mt-6 min-h-11 text-sm font-semibold ${accent} hover:text-white transition-colors`}
        >
          {start.label}
        </a>
      </div>

      {/* Picture */}
      <figure className={`glass-card p-3 lg:p-4 ${flip ? 'lg:order-1' : ''}`} data-glow>
        <Image
          src={picture.src}
          alt={picture.alt}
          width={1200}
          height={800}
          sizes="(min-width: 1024px) 560px, 100vw"
          className="w-full h-auto rounded-xl"
        />
        <figcaption className="flex items-baseline justify-between gap-4 px-1 pt-3">
          <span className={`text-[10px] font-mono uppercase tracking-[0.15em] ${accent} opacity-80`}>{time}</span>
          <span className="text-xs text-slate-400 text-right">{tagline}</span>
        </figcaption>
      </figure>
    </motion.div>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function ThreePillars() {
  return (
    <section id="pillars" className="py-24 lg:py-32 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-800/40 border border-slate-700/30 mb-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-400">What OIOS Does</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
            <span className="text-white">Three pillars.</span>{' '}
            <span className="gradient-text">One Jarvis.</span>
          </h2>
          <p className="mt-5 text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            The assistant you talk to. The back office behind the work. The workflows that keep going while you are away. Most owners hand him one first.
          </p>
        </motion.div>

        {/* Pillars */}
        <div className="space-y-24 lg:space-y-32">
          {PILLARS.map((pillar, i) => (
            <div key={pillar.title}>
              {i > 0 && <div className="section-divider mb-24 lg:mb-32" />}
              <Pillar pillar={pillar} />
            </div>
          ))}
        </div>

        <p className="mt-20 text-center text-sm text-slate-400">
          Across all three, nothing is spent, sent or deleted without your tap.
        </p>

      </div>
    </section>
  )
}
