'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { MagneticButton } from '@/components/ui/MagneticButton'

type FormData = {
  fullName: string
  businessName: string
  phoneNumber: string
  trade: string
  biggestFrustration: string
}

const initialFormData: FormData = {
  fullName: '',
  businessName: '',
  phoneNumber: '',
  trade: '',
  biggestFrustration: '',
}

const tradeOptions = ['HVAC', 'Plumbing', 'Electrical', 'Roofing', 'Landscaping', 'Pest Control', 'Locksmith', 'General Contractor', 'Other']

const inputClass = 'w-full h-[52px] bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 text-white placeholder-slate-500 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/25 focus:shadow-[0_0_15px_-3px_rgba(45,212,191,0.15)] transition-all duration-300'
const selectClass = 'w-full h-[52px] bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 text-white appearance-none cursor-pointer focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/25 focus:shadow-[0_0_15px_-3px_rgba(45,212,191,0.15)] transition-all duration-300'
const textareaClass = 'w-full min-h-[100px] bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/25 focus:shadow-[0_0_15px_-3px_rgba(45,212,191,0.15)] transition-all duration-300 resize-y'

// ─── Animated Success Checkmark ──────────────────────────────────────────────
function SuccessCheckmark() {
  return (
    <div className="w-20 h-20 mx-auto mb-8 relative">
      <motion.div
        className="absolute inset-0 rounded-full bg-emerald-500/20"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.3, 1] }}
        transition={{ duration: 0.6, times: [0, 0.6, 1] }}
      />
      <svg className="w-20 h-20 relative z-10" viewBox="0 0 80 80">
        <motion.circle
          cx="40" cy="40" r="35"
          fill="none"
          stroke="#34D399"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6 }}
        />
        <motion.path
          d="M25 42l10 10 20-22"
          fill="none"
          stroke="#34D399"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />
      </svg>
      {/* Particle burst */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * 360
        const rad = (angle * Math.PI) / 180
        return (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              left: '50%',
              top: '50%',
              backgroundColor: i % 2 === 0 ? '#2DD4BF' : '#F59E0B',
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(rad) * 50,
              y: Math.sin(rad) * 50,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          />
        )
      })}
    </div>
  )
}

export function AuditForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true })

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <section id="audit" className="py-24 lg:py-32 bg-bg-secondary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="glass-card p-10 lg:p-14 text-center">
              <SuccessCheckmark />
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
                You&apos;re In
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-6">
                Your audit request is in. Wes will reach out within 24 hours.
              </p>
              <p className="text-amber-400 font-semibold">
                — Wes, Omnia Intelligence AI
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="audit" className="py-24 lg:py-32 bg-bg-secondary">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={headerRef}
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-800/40 border border-slate-700/30 mb-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-slate-400">Get Started</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-5" style={{ fontFamily: 'var(--font-display), sans-serif' }}>
            Book Your Free AI Operations Audit
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            4 questions. 30 seconds. We&apos;ll show you exactly where AI saves you the most time.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="glass-card p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Business Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="ABC Plumbing"
                    value={formData.businessName}
                    onChange={(e) => handleChange('businessName', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="(XXX) XXX-XXXX"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">What trade are you in? *</label>
                  <select
                    required
                    value={formData.trade}
                    onChange={(e) => handleChange('trade', e.target.value)}
                    className={selectClass}
                  >
                    <option value="" disabled className="bg-slate-800">Select your trade</option>
                    {tradeOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-slate-800">{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  What&apos;s your biggest frustration?{' '}
                  <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <textarea
                  placeholder="The thing that keeps you up at night..."
                  value={formData.biggestFrustration}
                  onChange={(e) => handleChange('biggestFrustration', e.target.value)}
                  rows={2}
                  className={textareaClass}
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="pt-4">
                <MagneticButton className="w-full">
                  <button
                    type="submit"
                    disabled={submitting}
                    data-glow
                    data-cursor="cta"
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-white py-4 rounded-xl font-semibold text-lg btn-glow hover:from-amber-600 hover:to-amber-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Book My Audit Call →'}
                  </button>
                </MagneticButton>
                <p className="text-center text-slate-500 text-xs mt-3">
                  Takes 30 seconds
                </p>
              </div>

              <p className="text-center text-slate-500 text-sm">
                No spam. One follow-up call max. Usually within 24 hours.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
