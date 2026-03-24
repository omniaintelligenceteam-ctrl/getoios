'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
  Flame,
  Wrench,
  Zap,
  Key,
  Bug,
  Trees,
  HardHat,
  Home,
  Sparkles,
  DoorOpen,
} from 'lucide-react';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const trades = [
  { icon: Flame, name: 'HVAC', href: '/hvac', outcomes: ['Never miss an emergency call', 'Auto-quote maintenance plans', '+40% more booked appointments'] },
  { icon: Wrench, name: 'Plumbing', href: '/plumbing', outcomes: ['24/7 emergency dispatch coverage', 'Automated estimate follow-ups', 'Zero missed after-hours calls'] },
  { icon: Zap, name: 'Electrical', href: '/electrical', outcomes: ['Instant permit inquiry responses', 'Automated inspection scheduling', '15+ hours/week saved on admin'] },
  { icon: Key, name: 'Locksmith', href: '/locksmith', outcomes: ['Capture every lockout call 24/7', 'Instant quote generation', 'GPS-based job routing'] },
  { icon: Bug, name: 'Pest Control', href: '/pest-control', outcomes: ['+60% seasonal booking capture', 'Automated retreatment reminders', 'Review requests after every job'] },
  { icon: Trees, name: 'Landscape Lighting', href: '/landscape-lighting', outcomes: ['Same-day consultation booking', 'Seasonal promotion campaigns', 'Project milestone updates'] },
  { icon: HardHat, name: 'General Contractors', href: '/form', outcomes: ['Subcontractor coordination automation', 'Change order tracking', '3x faster proposal turnaround'] },
  { icon: Home, name: 'Roofing', href: '/form', outcomes: ['Storm damage lead capture', 'Insurance claim follow-ups', 'Drone inspection scheduling'] },
  { icon: Sparkles, name: 'Cleaning', href: '/form', outcomes: ['Recurring appointment management', 'Last-minute booking capture', 'Automated supply tracking'] },
  { icon: DoorOpen, name: 'Garage Door', href: '/form', outcomes: ['Emergency repair dispatch 24/7', 'Spring replacement reminders', 'Warranty tracking automation'] },
];

export function WhoItsFor() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-32 bg-bg-primary relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-800/40 border border-slate-700/30 mb-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-400">
              Built For the Trades
            </span>
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-6"
          style={{ fontFamily: 'var(--font-display), sans-serif' }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Your Entire Back Office,{' '}
          <span className="gradient-text">Run by AI.</span>
        </motion.h2>

        {/* Bento Trade Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4 mt-16">
          {trades.map((trade, i) => (
            <Link key={trade.name} href={trade.href}>
              <motion.div
                className="relative rounded-xl bg-slate-900/60 border border-slate-700/30 p-4 lg:p-5 h-full"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <GlowingEffect
                  disabled={false}
                  spread={40}
                  glow
                  blur={6}
                  proximity={80}
                  inactiveZone={0.01}
                  borderWidth={2}
                  movementDuration={1.5}
                />
                <div className="relative z-10 text-center">
                  <div className="mx-auto mb-3 w-11 h-11 rounded-xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center">
                    <trade.icon className="w-5 h-5 text-teal-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display), sans-serif' }}>{trade.name}</h3>
                  <ul className="space-y-1">
                    {trade.outcomes.map((outcome) => (
                      <li key={outcome} className="text-[11px] text-slate-400 flex items-start gap-1.5 text-left">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-teal-400 opacity-60 flex-shrink-0" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Bold Statement */}
        <motion.p
          className="text-center mt-16 text-lg sm:text-xl text-slate-300 font-semibold max-w-2xl mx-auto"
          style={{ fontFamily: 'var(--font-display), sans-serif' }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          5-50 person service companies drowning in admin work.{' '}
          <span className="text-white">
            We automate the entire operation.
          </span>
        </motion.p>
      </div>
    </section>
  );
}
