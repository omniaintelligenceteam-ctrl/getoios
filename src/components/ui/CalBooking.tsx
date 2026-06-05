'use client'

import Cal, { getCalApi } from '@calcom/embed-react'
import { useEffect, useState } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface CalBookingProps {
  /** Cal.com link, e.g. "oios/discovery" */
  calLink?: string
  /** Display layout */
  layout?: 'inline' | 'popup' | 'floating'
  /** Color theme */
  theme?: 'dark' | 'light'
  /** Additional CSS class for the container */
  className?: string
}

// ─── Inline Embed ────────────────────────────────────────────────────────────

function CalInline({
  calLink,
  theme = 'dark',
  className = '',
}: Omit<CalBookingProps, 'layout'>) {
  const link = calLink || process.env.NEXT_PUBLIC_CALCOM_LINK || ''
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !link) return

    // Apply theme via the ui API (cssVarsPerTheme isn't part of inline config)
    ;(async () => {
      const cal = await getCalApi({ namespace: 'oios-booking' })
      cal('ui', {
        theme: theme,
        cssVarsPerTheme: {
          dark: {
            'cal-bg': '#0a0a0a',
            'cal-bg-emphasis': '#111111',
            'cal-text': '#ffffff',
            'cal-text-emphasis': '#ffffff',
            'cal-text-muted': '#94a3b8',
            'cal-border': '#1e293b',
            'cal-border-emphasis': '#334155',
            'cal-brand': '#2dd4bf',
            'cal-brand-emphasis': '#14b8a6',
            'cal-brand-text': '#000000',
          },
          light: {
            'cal-brand': '#2dd4bf',
            'cal-brand-emphasis': '#14b8a6',
            'cal-brand-text': '#ffffff',
          },
        },
        hideEventTypeDetails: false,
        layout: 'month_view',
      })
    })()
  }, [mounted, theme, link])

  // Don't render during SSR or if no cal link is configured
  if (!mounted || !link) {
    return (
      <div className={`relative w-full min-h-[500px] ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin" />
            <span className="text-sm text-slate-500 tracking-wide">
              Loading calendar...
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative w-full min-h-[500px] ${className}`}>
      <Cal
        namespace="oios-booking"
        calLink={link}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'auto',
          minHeight: '500px',
        }}
        config={{
          layout: 'month_view',
          theme: theme,
        }}
      />
    </div>
  )
}

// ─── Popup Trigger ───────────────────────────────────────────────────────────

export function useCalPopup(calLink?: string, theme: 'dark' | 'light' = 'dark') {
  const link = calLink || process.env.NEXT_PUBLIC_CALCOM_LINK || ''

  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi({ namespace: 'oios-popup' })
      cal('ui', {
        theme: theme,
        cssVarsPerTheme: {
          dark: {
            'cal-bg': '#0a0a0a',
            'cal-bg-emphasis': '#111111',
            'cal-text': '#ffffff',
            'cal-text-emphasis': '#ffffff',
            'cal-text-muted': '#94a3b8',
            'cal-border': '#1e293b',
            'cal-border-emphasis': '#334155',
            'cal-brand': '#2dd4bf',
            'cal-brand-emphasis': '#14b8a6',
            'cal-brand-text': '#000000',
          },
          light: {
            'cal-brand': '#2dd4bf',
            'cal-brand-emphasis': '#14b8a6',
            'cal-brand-text': '#ffffff',
          },
        },
        hideEventTypeDetails: false,
        layout: 'month_view',
      })
    })()
  }, [theme, link])

  const openPopup = () => {
    ;(async () => {
      const cal = await getCalApi({ namespace: 'oios-popup' })
      cal('modal', {
        calLink: link,
        config: {
          layout: 'month_view',
          theme: theme,
        },
      })
    })()
  }

  return { openPopup }
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function CalBooking({
  calLink,
  layout = 'inline',
  theme = 'dark',
  className = '',
}: CalBookingProps) {
  if (layout === 'inline') {
    return <CalInline calLink={calLink} theme={theme} className={className} />
  }

  // For popup/floating, render nothing — use useCalPopup hook instead
  return null
}
