'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

export function WhoItsFor() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="pt-24 lg:pt-32 pb-8 bg-bg-primary relative overflow-hidden"
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
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center"
          style={{ fontFamily: 'var(--font-display), sans-serif' }}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Your Entire Back Office,{' '}
          <span className="gradient-text">Run by OIOS.</span>
        </motion.h2>
      </div>
    </section>
  );
}
