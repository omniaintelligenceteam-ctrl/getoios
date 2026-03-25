'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
  Phone,
  Calendar,
  TrendingUp,
  Megaphone,
  Settings,
  DollarSign,
} from 'lucide-react';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const capabilities = [
  { icon: Phone, name: 'Phones', outcomes: ['Every call answered 24/7', 'Instant SMS & email alerts', 'Caller memory & call intelligence'] },
  { icon: Calendar, name: 'Scheduling', outcomes: ['Live booking right on the call', 'Calendar sync with your software', 'Reminders that cut no-shows'] },
  { icon: TrendingUp, name: 'Sales', outcomes: ['No lead falls through the cracks', 'Smart upselling on every call', 'Pipeline tracking & lead scoring'] },
  { icon: Megaphone, name: 'Marketing', outcomes: ['Automated Google review requests', 'Past customer re-engagement', 'Email & text campaigns'] },
  { icon: Settings, name: 'Operations', outcomes: ['Morning briefings delivered daily', 'CRM sync & customer history', 'Custom reports & KPI dashboards'] },
  { icon: DollarSign, name: 'Finance', outcomes: ['Automated invoice follow-ups', 'Cash flow monitoring & alerts', 'Profitability tracking per job'] },
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
              Built For Small Business
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
          <span className="gradient-text">Run by OIOS.</span>
        </motion.h2>

        {/* Bento Trade Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4 mt-16">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.name}
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
                  <cap.icon className="w-5 h-5 text-teal-400" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display), sans-serif' }}>{cap.name}</h3>
                <ul className="space-y-1">
                  {cap.outcomes.map((outcome) => (
                    <li key={outcome} className="text-[11px] text-slate-400 flex items-start gap-1.5 text-left">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-teal-400 opacity-60 flex-shrink-0" />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
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
          Small businesses ready to automate their back office.{' '}
          <span className="text-white">
            We automate the entire operation.
          </span>
        </motion.p>
      </div>
    </section>
  );
}
