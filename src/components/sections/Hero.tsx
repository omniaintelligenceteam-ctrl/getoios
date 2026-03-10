'use client'

import Link from 'next/link'
import { FadeIn } from '@/components/ui/FadeIn'
import { FloatingPaths } from '@/components/ui/background-paths'
import { BarChart2, Zap, RefreshCw, Phone } from 'lucide-react'

const capabilities = [
  {
    label: 'MONITOR',
    icon: BarChart2,
    color: 'text-teal-400',
    border: 'border-teal-400/20',
    glow: 'group-hover:text-teal-300',
    items: ['Pipeline at a glance', 'Revenue tracking', 'AI morning briefing', 'Weekly report'],
  },
  {
    label: 'BUILD',
    icon: Zap,
    color: 'text-amber-400',
    border: 'border-amber-400/20',
    glow: 'group-hover:text-amber-300',
    items: ['Proposals in 30 sec', 'Client onboarding', 'Email drafts ready', 'Workflows on day 1'],
  },
  {
    label: 'AUTOMATE',
    icon: RefreshCw,
    color: 'text-cyan-400',
    border: 'border-cyan-400/20',
    glow: 'group-hover:text-cyan-300',
    items: ['Follow-ups sent', 'CRM kept current', 'Stale deal alerts', 'Review requests'],
  },
  {
    label: 'RUN',
    icon: Phone,
    color: 'text-emerald-400',
    border: 'border-emerald-400/20',
    glow: 'group-hover:text-emerald-300',
    items: ['24/7 call answering', 'Lead scoring', 'Appt booking', 'Call transcripts'],
  },
]

const stats = [
  { value: '98%', label: 'Call Answer Rate' },
  { value: '24/7/365', label: 'Coverage' },
  { value: '30 sec', label: 'Proposals' },
  { value: '0', label: 'Missed Follow-Ups' },
]

export function Hero() {
  return (
    <section className="relative min-h-screen bg-bg-primary overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="hero-grid absolute inset-0"></div>
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-36 pb-20">

        {/* Badge */}
        <FadeIn>
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-800/30 border border-slate-700/30">
              <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-slate-400">
                AI Operations for Service Businesses
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Headline */}
        <FadeIn delay={100}>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight text-center mb-6" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
            <span className="text-white">We Install AI Into Your Business.</span>
            <br />
            <span className="gradient-text-warm">It Handles the Rest.</span>
          </h1>
        </FadeIn>

        {/* Subheadline */}
        <FadeIn delay={200}>
          <p className="text-lg text-slate-400 text-center mb-12 max-w-2xl mx-auto leading-relaxed">
            OIOS handles your calls, runs your admin, and gives you a real-time command center —
            so you can focus on the actual work.
          </p>
        </FadeIn>

        {/* 4-Column Capability Grid */}
        <FadeIn delay={300}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {capabilities.map((cap) => {
              const Icon = cap.icon
              return (
                <div
                  key={cap.label}
                  className={`group glass-card p-5 border ${cap.border} hover:border-opacity-50 transition-all duration-300`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Icon className={`w-4 h-4 ${cap.color} ${cap.glow} transition-colors`} />
                    <span className={`text-[10px] font-mono font-bold tracking-[0.2em] ${cap.color}`}>
                      {cap.label}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {cap.items.map((item) => (
                      <li key={item} className="text-xs text-slate-400 flex items-start gap-1.5">
                        <span className={`mt-1 w-1 h-1 rounded-full ${cap.color} opacity-60 flex-shrink-0`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </FadeIn>

        {/* Stat Bar */}
        <FadeIn delay={400}>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 mb-10">
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-xl font-bold gradient-text-warm">{stat.value}</div>
                  <div className="text-[11px] text-slate-500 uppercase tracking-wider">{stat.label}</div>
                </div>
                {i < stats.length - 1 && (
                  <div className="hidden sm:block w-px h-8 bg-slate-700/50" />
                )}
              </div>
            ))}
          </div>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={500}>
          <div className="flex justify-center">
            <Link
              href="#audit"
              data-glow
              className="bg-gradient-to-r from-amber-500 to-amber-400 text-white px-10 py-4 rounded-lg font-semibold text-lg btn-glow hover:from-amber-600 hover:to-amber-500 transition-all duration-200"
            >
              Book Your Free Audit →
            </Link>
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
