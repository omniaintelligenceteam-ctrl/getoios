'use client'

import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { Check, X, Minus } from 'lucide-react'

const features = [
  { name: '24/7 coverage', oios: true, officeManager: false, answeringService: true, crm: false },
  { name: 'Qualifies leads', oios: true, officeManager: true, answeringService: false, crm: false },
  { name: 'Automated follow-ups', oios: true, officeManager: false, answeringService: false, crm: 'partial' },
  { name: 'KPI dashboards', oios: true, officeManager: false, answeringService: false, crm: true },
  { name: 'Marketing automation', oios: true, officeManager: false, answeringService: false, crm: false },
  { name: 'Financial reporting', oios: true, officeManager: 'partial', answeringService: false, crm: false },
  { name: 'No turnover risk', oios: true, officeManager: false, answeringService: true, crm: true },
  { name: 'Scales with your business', oios: true, officeManager: false, answeringService: false, crm: true },
]

function StatusIcon({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="w-4 h-4 text-emerald-400" />
  if (value === false) return <X className="w-4 h-4 text-red-400/50" />
  return <Minus className="w-4 h-4 text-amber-400/60" />
}

export function ComparisonTable() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative py-20 sm:py-28 bg-bg-secondary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/15 mb-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-amber-400/80">Why OIOS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
            <span className="text-white">Replace the Cost,</span>{' '}
            <span className="gradient-text-warm">Keep the Results</span>
          </h2>
          <p className="text-slate-500 text-base max-w-lg mx-auto">
            See how OIOS stacks up against the alternatives you&apos;re already considering.
          </p>
        </motion.div>

        {/* Table */}
        <motion.div
          className="glass-card border border-slate-700/30 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/30">
                  <th className="text-left p-4 sm:p-5 text-slate-500 font-normal text-xs uppercase tracking-wider">Feature</th>
                  <th className="p-4 sm:p-5 text-center">
                    <span className="gradient-text-warm font-bold text-base">OIOS</span>
                  </th>
                  <th className="p-4 sm:p-5 text-center text-slate-500 text-xs">Office Manager</th>
                  <th className="p-4 sm:p-5 text-center text-slate-500 text-xs">Answering Service</th>
                  <th className="p-4 sm:p-5 text-center text-slate-500 text-xs">CRM Software</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, i) => (
                  <tr key={feature.name} className={`border-b border-slate-700/15 ${i % 2 === 0 ? 'bg-slate-800/10' : ''}`}>
                    <td className="p-4 sm:p-5 text-slate-300 text-sm">{feature.name}</td>
                    <td className="p-4 sm:p-5 text-center"><StatusIcon value={feature.oios} /></td>
                    <td className="p-4 sm:p-5 text-center"><StatusIcon value={feature.officeManager} /></td>
                    <td className="p-4 sm:p-5 text-center"><StatusIcon value={feature.answeringService} /></td>
                    <td className="p-4 sm:p-5 text-center"><StatusIcon value={feature.crm} /></td>
                  </tr>
                ))}
                {/* Cost row */}
                <tr className="border-t border-slate-700/30 bg-slate-800/20">
                  <td className="p-4 sm:p-5 text-white font-semibold">Annual cost</td>
                  <td className="p-4 sm:p-5 text-center">
                    <span className="gradient-text-warm font-bold text-lg">Fraction</span>
                    <br />
                    <span className="text-[10px] text-slate-500">of a hire</span>
                  </td>
                  <td className="p-4 sm:p-5 text-center text-slate-400">$40-60K</td>
                  <td className="p-4 sm:p-5 text-center text-slate-400">$3-8K</td>
                  <td className="p-4 sm:p-5 text-center text-slate-400">$1-5K</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
