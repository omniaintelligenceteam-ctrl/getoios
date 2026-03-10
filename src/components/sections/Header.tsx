'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const navLinks = [
  { href: '#pillars', label: 'What It Does' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#voice-demo', label: 'Live Demo', accent: true },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20)

      // Scroll spy — find which section is most visible
      const sections = ['pillars', 'how-it-works', 'voice-demo', 'pricing', 'audit']
      let current = ''
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 150 && rect.bottom > 150) {
            current = id
          }
        }
      }
      setActiveSection(current)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-[#0B1120]/95 backdrop-blur-xl border-b border-slate-700/40 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.2),0_1px_0_0_rgba(45,212,191,0.08)]'
        : 'bg-[#0B1120] border-b border-slate-800/30'
    }`}>
      <div className="max-w-7xl mx-auto pl-2 sm:pl-4 pr-4 sm:pr-6 lg:pr-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 lg:space-x-4 group">
            <Image
              src="/logo-bolt.png"
              alt="OIOS"
              width={2048}
              height={1842}
              className="w-auto h-15 lg:h-19.5 object-contain"
              priority
            />
            <div className="flex flex-col">
              <span className="text-base lg:text-xl tracking-[0.25em] font-bold leading-none">
                <span className="gradient-text-warm">OIOS</span>
              </span>
              <span className="text-[10px] tracking-[0.15em] text-slate-500 font-medium mt-0.5">
                by Omnia Intelligence AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const sectionId = link.href.replace('#', '')
              const isActive = activeSection === sectionId
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm tracking-wide transition-colors duration-300 ${
                    link.accent
                      ? `${isActive ? 'text-teal-300' : 'text-teal-400 hover:text-teal-300'} font-medium`
                      : `${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`
                  }`}
                >
                  {link.label}
                  {/* Animated underline */}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-teal-400 transition-all duration-300 ${
                      isActive ? 'w-full opacity-100' : 'w-0 opacity-0'
                    }`}
                  />
                </Link>
              )
            })}
          </nav>

          {/* Status Badge & CTA */}
          <div className="hidden md:flex items-center space-x-5">
            <div className="flex items-center space-x-2 text-xs font-mono">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-400/80">Online</span>
            </div>

            <Link
              href="#audit"
              data-glow
              className="bg-gradient-to-r from-amber-500 to-amber-400 text-white px-5 py-2 rounded-lg text-sm font-medium btn-glow hover:from-amber-600 hover:to-amber-500 transition-all duration-200"
            >
              Book Your Free Audit →
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-slate-800/30">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors duration-200 text-sm ${
                    link.accent
                      ? 'text-teal-400 hover:text-teal-300 font-medium'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-slate-800/30 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-mono">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400/80">Online</span>
                </div>
                <Link
                  href="#audit"
                  data-glow
                  className="block bg-gradient-to-r from-amber-500 to-amber-400 text-white px-4 py-2.5 rounded-lg text-sm font-medium btn-glow hover:from-amber-600 hover:to-amber-500 transition-all duration-200 text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Book Your Free Audit →
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
