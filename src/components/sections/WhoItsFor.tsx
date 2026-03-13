'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import {
  Thermometer,
  Wrench,
  Zap,
  KeyRound,
  Bug,
  Trees,
} from 'lucide-react';

const trades = [
  {
    icon: Thermometer,
    name: 'HVAC',
    hook: 'Never miss an emergency call again',
  },
  {
    icon: Wrench,
    name: 'Plumbing',
    hook: "Book jobs while you're under the sink",
  },
  {
    icon: Zap,
    name: 'Electrical',
    hook: 'Let AI handle the phone while you handle the wires',
  },
  {
    icon: KeyRound,
    name: 'Locksmith',
    hook: 'Capture lockout calls 24/7',
  },
  {
    icon: Bug,
    name: 'Pest Control',
    hook: 'Schedule treatments without stopping work',
  },
  {
    icon: Trees,
    name: 'Landscaping',
    hook: "Quote new clients while you're on the mower",
  },
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
              Who This Is For
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
          If Your Phone Goes to Voicemail,{' '}
          <span className="gradient-text">This Is For You.</span>
        </motion.h2>

        {/* Trade Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-16">
          {trades.map((trade, index) => {
            const Icon = trade.icon;
            return (
              <motion.div
                key={trade.name}
                className="glass-card group relative rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(45,212,191,0.08)]"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.2 + index * 0.1,
                  ease: 'easeOut',
                }}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center group-hover:bg-teal-400/15 group-hover:border-teal-400/30 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold text-white mb-1"
                      style={{
                        fontFamily: 'var(--font-display), sans-serif',
                      }}
                    >
                      {trade.name}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {trade.hook}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bold Statement */}
        <motion.p
          className="text-center mt-16 text-lg sm:text-xl text-slate-300 font-semibold max-w-2xl mx-auto"
          style={{ fontFamily: 'var(--font-display), sans-serif' }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          5-50 person service companies losing leads to voicemail.{' '}
          <span className="text-white">
            That&apos;s who we built this for.
          </span>
        </motion.p>
      </div>
    </section>
  );
}
