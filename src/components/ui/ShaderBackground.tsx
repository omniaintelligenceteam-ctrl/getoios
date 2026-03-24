'use client'

import { Suspense, lazy, useState, useEffect } from 'react'

// Dynamic import — Spline is heavy, no SSR
const Spline = lazy(() => import('@splinetool/react-spline'))

const SCENE_URL = 'https://prod.spline.design/dJqTIQ-tE3ULUPMi/scene.splinecode'

export function ShaderBackground() {
  const [loaded, setLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showSpline, setShowSpline] = useState(false)

  useEffect(() => {
    // Skip on mobile (too heavy) or reduced motion
    const mobile = window.innerWidth < 768
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setIsMobile(mobile || reducedMotion)

    // Delay Spline load slightly so hero text renders first
    if (!mobile && !reducedMotion) {
      const timer = setTimeout(() => setShowSpline(true), 100)
      return () => clearTimeout(timer)
    }
  }, [])

  // Mobile fallback — no 3D, just subtle gradient
  if (isMobile) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(99,102,241,0.08) 0%, transparent 60%)',
        }}
      />
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ pointerEvents: 'auto' }}>
      {/* 3D Spline Scene */}
      {showSpline && (
        <Suspense fallback={null}>
          <Spline
            scene={SCENE_URL}
            onLoad={() => setLoaded(true)}
            style={{
              width: '100%',
              height: '100%',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 1.2s ease',
              pointerEvents: 'auto',
            }}
          />
        </Suspense>
      )}

      {/* Gradient overlays for text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to right, rgba(11,17,32,0.85) 0%, transparent 35%, transparent 65%, rgba(11,17,32,0.85) 100%),
            linear-gradient(to bottom, rgba(11,17,32,0.3) 0%, transparent 30%, transparent 55%, rgba(11,17,32,0.95) 100%)
          `,
        }}
      />
    </div>
  )
}
