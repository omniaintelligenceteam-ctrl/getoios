'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useCalPopup } from '@/components/ui/CalBooking'
import { hostGrotesk } from '@/lib/fonts'

// Each link opens a section of the front door. `/` is a static page with no
// Next payload, so these are plain anchors, never next/link (door-links.spec.ts).
// The words are the front door's own nav words (public/jarvis/index.html).
const navLinks: { href: string; label: string }[] = [
  { href: '/#today', label: 'Product' },
  { href: '/#setup', label: 'Setup' },
  { href: '/#behind', label: 'Story' },
]

// The front door's colours on its dark ground: ink #fff, muted #969696, action #762bee.
const primary =
  'bg-[#762bee] text-white hover:bg-[#6a22e0] active:translate-y-px transition-colors duration-150 rounded-lg font-medium text-center'
const secondary =
  'border border-white/25 text-white hover:border-white/60 hover:bg-white/5 active:translate-y-px transition-colors duration-150 rounded-lg font-medium text-center cursor-pointer'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showMobileCTA, setShowMobileCTA] = useState(false)
  const { openPopup: openCalPopup } = useCalPopup()

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20)
      setShowMobileCTA(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
    <header className={`${hostGrotesk.className} fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b ${
      scrolled ? 'bg-[#090909]/95 backdrop-blur-xl border-white/15' : 'bg-[#090909] border-white/10'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 text-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/jarvis/assets/brand/mark-purple-white.svg" alt="" width={24} height={24} className="w-6 h-6" />
            <span className="text-lg font-medium tracking-[-0.01em] leading-none">Jarvis</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-[#b9b9b9] hover:text-white transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* The two actions */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={openCalPopup} data-cursor="cta" className={`${secondary} px-5 py-2 text-sm whitespace-nowrap shrink-0`}>
              Book a call
            </button>
            <a href="/#start" data-cursor="cta" className={`${primary} px-5 py-2 text-sm whitespace-nowrap shrink-0`}>
              Request a call or email
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close the menu' : 'Open the menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-3 -mr-1 text-[#b9b9b9] hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu — Animated */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden py-6 border-t border-white/10 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <nav className="flex flex-col space-y-1" aria-label="Main">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                  >
                    <a
                      href={link.href}
                      className="block py-2.5 text-base text-[#b9b9b9] hover:text-white transition-colors duration-150"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  </motion.div>
                ))}

                <motion.div
                  className="pt-4 mt-3 border-t border-white/10 space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, delay: 0.15 }}
                >
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      openCalPopup()
                    }}
                    data-cursor="cta"
                    className={`${secondary} block w-full px-4 py-3.5 text-sm`}
                  >
                    Book a call
                  </button>
                  <a
                    href="/#start"
                    data-cursor="cta"
                    className={`${primary} block px-4 py-3.5 text-sm`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Request a call or email
                  </a>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>

      {/* Sticky Mobile CTA Bar */}
      <AnimatePresence>
        {showMobileCTA && (
          <motion.div
            className={`${hostGrotesk.className} fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#090909]/95 backdrop-blur-xl border-t border-white/15`}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="px-4 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
              <a href="/#start" data-cursor="cta" className={`${primary} block w-full px-5 py-3.5 text-sm`}>
                Request a call or email
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
