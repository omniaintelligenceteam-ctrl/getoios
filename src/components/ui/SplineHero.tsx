'use client'

import { Suspense, lazy, useState, useEffect, useRef } from 'react'

// Dynamic import — no SSR for Spline (heavy 3D library)
const Spline = lazy(() => import('@splinetool/react-spline'))

// ─── Default Spline scene URL ────────────────────────────────────────────────
// Swap this URL to use a custom OIOS-branded scene from Spline editor
// Create at: https://app.spline.design → export → copy production URL
const DEFAULT_SCENE = 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode'

interface SplineHeroProps {
  scene?: string
  className?: string
}

export function SplineHero({ scene = DEFAULT_SCENE, className }: SplineHeroProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Mobile detection — skip Spline on mobile (too heavy)
  useEffect(() => {
    const mobile = window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setIsMobile(mobile)
  }, [])

  // Lazy load via IntersectionObserver — only load Spline when in viewport
  useEffect(() => {
    if (isMobile) return
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)

    return () => observer.disconnect()
  }, [isMobile])

  // Timeout fallback — if scene takes too long, hide loader
  useEffect(() => {
    if (!isVisible || loaded) return
    const timeout = setTimeout(() => {
      if (!loaded) setError(true)
    }, 12000) // 12s timeout
    return () => clearTimeout(timeout)
  }, [isVisible, loaded])

  // Don't render on mobile or if reduced-motion
  if (isMobile) return null

  return (
    <div
      ref={containerRef}
      className={`relative ${className || ''}`}
      style={{ opacity: loaded ? 1 : 0.3, transition: 'opacity 0.8s ease' }}
    >
      {isVisible && !error && (
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-teal-400" />
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Loading 3D</span>
              </div>
            </div>
          }
        >
          <Spline
            scene={scene}
            className="w-full h-full"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
          />
        </Suspense>
      )}
    </div>
  )
}
