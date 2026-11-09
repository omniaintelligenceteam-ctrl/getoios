import { useEffect, useState } from 'react'
import type { LookTokens } from '../../kit'

// The product look for the getoios /features tiles: the page's slate night,
// its Inter, quiet surfaces a step lighter than the page. Each tile adds its
// pillar's accent (teal, amber, cyan) on the one action.
export const OIOS_TOKENS: LookTokens = {
  '--ss-canvas': '#0d1424',
  '--ss-surface': '#111a2c',
  '--ss-chrome': '#162036',
  '--ss-raised': '#1a2438',
  '--ss-text-strong': '#f1f5f9',
  '--ss-text': '#94a3b8',
  '--ss-text-faint': '#64748b',
  '--ss-icon': '#94a3b8',
  '--ss-icon-faint': '#475569',
  '--ss-line': 'rgba(148, 163, 184, 0.12)',
  '--ss-line-faint': 'rgba(148, 163, 184, 0.08)',
  '--ss-success-text': '#34d399',
  '--ss-success-soft': 'rgba(52, 211, 153, 0.14)',
  '--ss-warning-text': '#fbbf24',
  '--ss-warning-soft': 'rgba(251, 191, 36, 0.14)',
  '--ss-font': 'var(--font-inter, "Inter"), system-ui, sans-serif',
}

// The kit measures label widths once, on mount (Roll, Button). If the page
// font arrives after that, labels keep the fallback font's widths and get
// cut, so a tile remounts its stage once the font has loaded.
export function useFontsReady() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let live = true
    const family = getComputedStyle(document.body).getPropertyValue('--font-inter').trim() || '"Inter"'
    Promise.all(['400', '500', '600'].map((w) => document.fonts.load(`${w} 13px ${family}`)))
      .catch(() => undefined)
      .then(() => { if (live) setReady(true) })
    return () => { live = false }
  }, [])
  return ready
}
