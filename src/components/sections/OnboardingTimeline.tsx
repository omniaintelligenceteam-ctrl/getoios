'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import {
  Link2,
  Sun,
  Rocket,
  BarChart3,
  Crown,
  Phone,
  Mail,
  Calendar,
  FileText,
} from 'lucide-react'

const milestones = [
  {
    time: 'Day 1',
    title: 'Connect & Configure',
    icon: Link2,
    items: [
      'Forward your business phone to OIOS',
      'Connect your email and calendar',
      'Share your CRM access (or we set one up)',
      'Tell us your pricing, services, and service area',
    ],
    highlight: 'Your AI receptionist starts answering calls today.',
    color: 'text-teal-400',
    dotColor: 'bg-teal-400',
    glowColor: 'rgba(45,212,191,0.5)',
  },
  {
    time: 'Day 2',
    title: 'Your First Morning Briefing',
    icon: Sun,
    items: [
      'Receive your first AI morning briefing by 7 AM',
      "See yesterday's calls, leads, and follow-ups summarized",
      'Review any decisions that need your input',
    ],
    highlight: 'This is the moment it clicks — your AI COO is working.',
    color: 'text-amber-400',
    dotColor: 'bg-amber-400',
    glowColor: 'rgba(245,158,11,0.5)',
  },
  {
    time: 'Week 1',
    title: 'Full Reception + Sales Active',
    icon: Rocket,
    items: [
      'All inbound calls answered and qualified 24/7',
      'Lead follow-ups sent automatically',
      'Proposals generated and tracked',
      'CRM updated in real-time',
    ],
    highlight: "By end of week 1, you've already recaptured missed leads.",
    color: 'text-emerald-400',
    dotColor: 'bg-emerald-400',
    glowColor: 'rgba(52,211,153,0.5)',
  },
  {
    time: 'Week 2',
    title: 'Marketing & Operations Online',
    icon: BarChart3,
    items: [
      'Review request campaigns activated',
      'Social media content calendar starts',
      'KPI dashboard populated with real data',
      'Workflow automations tuned to your business',
    ],
    highlight: null,
    color: 'text-cyan-400',
    dotColor: 'bg-cyan-400',
    glowColor: 'rgba(6,182,212,0.5)',
  },
  {
    time: 'Month 1',
    title: 'Full Autopilot',
    icon: Crown,
    items: [
      'All 6 AI departments fully operational',
      'Revenue tracking and financial reporting live',
      'Client success workflows monitoring satisfaction',
      'Weekly performance reports delivered automatically',
    ],
    highlight: 'Your business runs itself. You focus on the work you love.',
    color: 'text-violet-400',
    dotColor: 'bg-violet-400',
    glowColor: 'rgba(167,139,250,0.5)',
  },
]

const prerequisites = [
  { icon: Phone, title: 'Phone forwarding access', description: "We'll walk you through it in 5 minutes" },
  { icon: Mail, title: 'Email access', description: 'So your AI team can manage communications' },
  { icon: Calendar, title: 'Calendar access', description: 'For automated appointment booking' },
  { icon: FileText, title: 'Your services & pricing', description: 'So we quote accurately on your behalf' },
]

export function OnboardingTimeline() {
  const sectionRef = useRef(null)
  const sectionInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const prereqRef = useRef(null)
  const prereqInView = useInView(prereqRef, { once: true, margin: '-60px' })

  return (
    <>
      <section className="py-28 lg:py-36 bg-bg-secondary relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-teal-500/[0.04] to-transparent rounded-full blur-[100px]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <motion.div
            ref={sectionRef}
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/40 mb-8">
              <div className="w-1.5 h-1.5 bg-teal-400 rounded-full mr-2.5 animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-slate-400">
                What to Expect
              </span>
            </div>
            <h2
              className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}
            >
              <span className="text-white">From Signup to </span>
              <span className="gradient-text">Autopilot</span>
              <span className="text-white"> in 30 Days</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-lg mx-auto">
              Here&apos;s exactly what happens when you start with OIOS
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-teal-400/40 via-amber-400/20 to-violet-400/10" />

            <div className="space-y-8">
              {milestones.map((milestone, i) => {
                const Icon = milestone.icon
                return (
                  <motion.div
                    key={milestone.time}
                    className="relative pl-16 sm:pl-20"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-[17px] sm:left-[25px] top-6 w-4 h-4 rounded-full ${milestone.dotColor}`}
                      style={{ boxShadow: `0 0 15px ${milestone.glowColor}` }}
                    />

                    {/* Card */}
                    <div className="glass-card p-6 sm:p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700/40 flex items-center justify-center`}>
                          <Icon className={`w-4.5 h-4.5 ${milestone.color}`} />
                        </div>
                        <div>
                          <div className={`text-[10px] font-mono font-bold tracking-[0.2em] uppercase ${milestone.color}`}>
                            {milestone.time}
                          </div>
                          <h3
                            className="text-lg font-bold text-white"
                            style={{ fontFamily: 'var(--font-display), sans-serif' }}
                          >
                            {milestone.title}
                          </h3>
                        </div>
                      </div>

                      <ul className="space-y-2 mb-4">
                        {milestone.items.map((item) => (
                          <li key={item} className="text-sm text-slate-400 flex items-start gap-2">
                            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${milestone.dotColor} opacity-60 flex-shrink-0`} />
                            {item}
                          </li>
                        ))}
                      </ul>

                      {milestone.highlight && (
                        <p className={`text-sm font-semibold ${milestone.color} border-t border-slate-700/30 pt-3 mt-3`}>
                          {milestone.highlight}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ What We Need From You ═══ */}
      <section className="py-24 lg:py-32 bg-bg-primary relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={prereqRef}
            className="text-center mb-14"
            initial={{ opacity: 0, y: 24 }}
            animate={prereqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-3"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}
            >
              Just 4 Things to Get Started
            </h2>
            <p className="text-slate-400 text-lg">We handle the rest</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {prerequisites.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.title}
                  className="glass-card p-5 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={prereqInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-5 h-5 text-teal-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-500">{item.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
