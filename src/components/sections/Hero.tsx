'use client'

import Link from 'next/link'
import { useRef, useEffect, Suspense, lazy, useState } from 'react'
import { motion } from 'motion/react'
import { RotatingText } from '@/components/ui/RotatingText'
import { Plus } from 'lucide-react'

// ─── Spline 3D Background (lazy loaded) ─────────────────────────────────────
const Spline = lazy(() => import('@splinetool/react-spline'))
const SCENE_URL = 'https://prod.spline.design/dJqTIQ-tE3ULUPMi/scene.splinecode'

function HeroSplineBackground() {
  const [loaded, setLoaded] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Skip on mobile or reduced motion
    const skip = window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!skip) {
      const timer = setTimeout(() => setShow(true), 200)
      return () => clearTimeout(timer)
    }
  }, [])

  if (!show) return null

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ pointerEvents: 'auto' }}>
      <Suspense fallback={null}>
        <Spline
          scene={SCENE_URL}
          onLoad={() => setLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 1.5s ease',
            pointerEvents: 'auto',
          }}
        />
      </Suspense>
      {/* Gradient overlays for text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to right, rgba(0,0,0,0.8) 0%, transparent 35%, transparent 65%, rgba(0,0,0,0.8) 100%),
            linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 20%, transparent 55%, rgba(0,0,0,0.95) 100%)
          `,
        }}
      />
    </div>
  )
}

// ─── Hero Section ────────────────────────────────────────────────────────────
export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)

  // Fade content on scroll
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const handleScroll = () => {
      requestAnimationFrame(() => {
        const opacity = 1 - Math.min(window.scrollY / 500, 1)
        if (el) el.style.opacity = opacity.toString()
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* 3D Spline Background */}
      <div className="absolute inset-0 z-0">
        <HeroSplineBackground />
      </div>

      {/* Hero Content */}
      <div
        ref={heroRef}
        className="relative z-10 min-h-screen flex items-center pointer-events-none"
      >
        <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row justify-between items-start lg:items-center py-24 pt-32">

          {/* Left — Headline */}
          <motion.div
            className="w-full lg:w-1/2 pr-0 lg:pr-8 mb-10 lg:mb-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight"
              style={{ fontFamily: 'var(--font-display), sans-serif' }}
            >
              <span className="gradient-text-hero">Your Entire</span>
              <br />
              <span className="text-white">Back Office.</span>
              <br />
              <span className="mt-2 block">
                <RotatingText
                  phrases={['Run by AI.', 'Six Departments.', 'Zero Hires.', 'One Platform.']}
                  className="gradient-text-warm"
                />
              </span>
            </h1>
            <div className="text-xs sm:text-sm text-gray-400 opacity-70 mt-6 tracking-[0.2em] uppercase font-mono">
              Receptionist \ Sales \ Marketing \ Operations \ Finance \ Success
            </div>
          </motion.div>

          {/* Right — Description + CTAs */}
          <motion.div
            className="w-full lg:w-1/2 pl-0 lg:pl-8 flex flex-col items-start pointer-events-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="text-base sm:text-lg text-gray-300 opacity-80 mb-8 max-w-md leading-relaxed">
              OIOS is a team of AI agents that runs operations for your business — answering calls, managing leads, automating follow-ups, and tracking revenue. 24/7.
            </p>

            {/* Risk-reversal callout */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
              <span className="text-sm font-semibold text-emerald-400">
                Don&apos;t pay a dime until it pays for itself
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <Link href="/form">
                <button className="border border-white text-white font-semibold py-3.5 px-8 rounded-2xl transition duration-300 hover:bg-white hover:text-black w-full sm:w-auto">
                  Start Risk-Free
                </button>
              </Link>
              <Link href="/demo">
                <button className="bg-white text-black font-semibold py-3.5 px-8 rounded-2xl transition duration-300 hover:scale-105 flex items-center justify-center w-full sm:w-auto">
                  <Plus className="w-5 h-5 mr-2 text-teal-500" />
                  Receptionist Demo
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
