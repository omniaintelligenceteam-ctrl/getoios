'use client'

import Link from 'next/link'
import { useRef, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { RotatingText } from '@/components/ui/RotatingText'
import { Card } from '@/components/ui/card'
import { Spotlight } from '@/components/ui/spotlight'
import { SplineScene } from '@/components/ui/splite'
import { ArrowRight, Plus, Cpu } from 'lucide-react'

// ─── Branded Spline scene ───────────────────────────────────────────────────────────
// Paste your Spline export URL here (app.spline.design → Export → copy production URL).
// While this is empty, a lightweight branded fallback renders instead of mounting the
// heavy 3D runtime — so the hero never crashes or stalls waiting on an unset scene.
const HERO_SPLINE_SCENE: string = ''

// ─── Hero 3D visual ──────────────────────────────────────────────────────────────────
// Reuses the proven guard pattern from SplineHero.tsx: skip on mobile / reduced-motion,
// lazy-load only when scrolled into view, and degrade to a static fallback when there's
// no scene URL set.
function HeroSplineVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const [showScene, setShowScene] = useState(false)

  useEffect(() => {
    // Desktop + motion-allowed only, and only when a scene URL is set — the 3D runtime
    // is too heavy for mobile/LCP. Otherwise the static fallback stays.
    const allow3D =
      window.innerWidth >= 768 &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!allow3D || !HERO_SPLINE_SCENE) return

    const el = ref.current
    if (!el) return

    // Lazy-load via IntersectionObserver — only mount Spline near the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowScene(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="absolute inset-0">
      {showScene ? (
        <SplineScene scene={HERO_SPLINE_SCENE} className="h-full w-full" />
      ) : (
        <HeroVisualFallback />
      )}
    </div>
  )
}

// Static, on-brand placeholder — concentric teal rings around a glowing core. Echoes the
// hero's backlit-sphere language so the empty/unset state reads as intentional, not broken.
function HeroVisualFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative h-56 w-56 sm:h-72 sm:w-72">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(45,212,191,0.18) 0%, transparent 60%)',
            filter: 'blur(30px)',
          }}
        />
        <div className="absolute inset-0 rounded-full border border-teal-500/20" />
        <div className="absolute inset-6 rounded-full border border-teal-500/15" />
        <div className="absolute inset-12 rounded-full border border-cyan-400/10" />
        <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-400 shadow-[0_0_24px_rgba(45,212,191,0.85)]" />
      </div>
    </div>
  )
}

// ─── Hero Section ──────────────────────────────────────────────────────────────────
export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const animate = !reduceMotion

  // Fade content on scroll
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const handleScroll = () => {
      requestAnimationFrame(() => {
        const opacity = 1 - Math.min(window.scrollY / 600, 1)
        if (el) el.style.opacity = opacity.toString()
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative min-h-screen bg-bg-primary flex flex-col">
      {/* ── Background: backlit sphere + sweeping light streaks (matches reference) ── */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="hero-mesh" />
        <div className="orb orb-1" />
        <div className="orb orb-3" />

        {/* Backlit central sphere behind the headline */}
        <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="relative w-[26rem] h-[26rem] sm:w-[36rem] sm:h-[36rem] lg:w-[44rem] lg:h-[44rem]">
            {/* soft outer halo */}
            <div
              className="absolute inset-[-18%] rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(45,212,191,0.14) 0%, transparent 60%)',
                filter: 'blur(50px)',
              }}
            />
            {/* dark dome body (slightly lit toward top) */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 50% 32%, rgba(20,40,62,0.85) 0%, rgba(11,17,32,0.55) 52%, transparent 72%)',
              }}
            />
            {/* glowing rim */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, transparent 54%, rgba(45,212,191,0.14) 60%, rgba(45,212,191,0.7) 65%, rgba(103,232,249,0.45) 68%, rgba(45,212,191,0.12) 72%, transparent 78%)',
                filter: 'blur(1.5px)',
              }}
            />
            {/* bright top-rim highlight (crescent) */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 50% 3%, rgba(165,243,252,0.8) 0%, rgba(103,232,249,0.28) 13%, transparent 25%)',
                filter: 'blur(2px)',
              }}
            />
          </div>
        </div>

        {/* Sweeping light streaks (giant arcs peeking from the bottom) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-[-120vw] w-[230vw] h-[230vw] rounded-full pointer-events-none"
          style={{ border: '1.5px solid rgba(45,212,191,0.38)', boxShadow: '0 0 90px rgba(45,212,191,0.22)' }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-[-128vw] w-[230vw] h-[230vw] rounded-full pointer-events-none"
          style={{ border: '1px solid rgba(6,182,212,0.24)' }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-[-112vw] w-[230vw] h-[230vw] rounded-full pointer-events-none"
          style={{ border: '1px solid rgba(103,232,249,0.16)' }}
        />

        {/* subtle grid dots */}
        <div className="absolute inset-0 hero-grid opacity-25" />

        {/* bottom fade so the card bleeds cleanly into the next section */}
        <div
          className="absolute inset-x-0 bottom-0 h-64 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-primary))' }}
        />
      </div>

      {/* ── Foreground content (two-column on lg+) ── */}
      <div
        ref={heroRef}
        className="relative z-10 flex-1 w-full max-w-7xl mx-auto grid lg:grid-cols-2 items-center gap-10 lg:gap-12 px-4 sm:px-6 lg:px-8 pt-32 lg:pt-28 pb-16 lg:pb-12"
      >
        {/* Left column — copy + CTAs */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Badge pill */}
          <motion.div
            initial={animate ? { opacity: 0, y: 16 } : false}
            animate={animate ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-teal-500/20 mb-7"
          >
            <Cpu className="w-4 h-4 text-teal-400" />
            <span className="text-sm font-medium text-slate-200">
              Month-to-month. You own everything we build.
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={animate ? { opacity: 0, y: 24 } : false}
            animate={animate ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-bold leading-[0.98] tracking-tight"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            <span className="gradient-text-hero">Your AI Operating System.</span>
            <span className="mt-2 block">
              <RotatingText
                phrases={['Installed.', 'Running.', 'Shipping monthly.', 'On retainer.']}
                className="gradient-text-warm"
              />
            </span>
          </motion.h1>

          {/* Sub-paragraph */}
          <motion.p
            initial={animate ? { opacity: 0, y: 24 } : false}
            animate={animate ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-7 max-w-xl text-base sm:text-lg text-gray-300/80 leading-relaxed"
          >
            We install your AI Operating System, ship your first build live in week one, then keep
            shipping on a monthly retainer. Phones, scheduling, sales, marketing, ops, finance &mdash;
            running 24/7.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={animate ? { opacity: 0, y: 24 } : false}
            animate={animate ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-9 flex flex-col sm:flex-row items-center gap-3"
          >
            <Link href="/form">
              <button className="bg-white text-black font-semibold py-3.5 px-8 rounded-2xl transition duration-300 hover:scale-105 flex items-center justify-center w-full sm:w-auto">
                Start Month 1
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </Link>
            <Link href="/demo">
              <button className="border border-white/70 text-white font-semibold py-3.5 px-8 rounded-2xl transition duration-300 hover:bg-white hover:text-black flex items-center justify-center w-full sm:w-auto">
                <Plus className="w-5 h-5 mr-2 text-teal-400" />
                See It Live
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Right column — interactive 3D scene in a spotlight card */}
        <motion.div
          initial={animate ? { opacity: 0, y: 40 } : false}
          animate={animate ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full"
        >
          <Card className="relative h-[440px] sm:h-[520px] w-full overflow-hidden border border-white/10 bg-black/[0.96]">
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#2DD4BF" />
            <HeroSplineVisual />
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
