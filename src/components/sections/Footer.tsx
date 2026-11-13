'use client'

import Link from 'next/link'
import { hostGrotesk } from '@/lib/fonts'

export function Footer() {
  // A `/#…` link opens a section of the static front door: plain anchor, never next/link.
  // The words are the front door's own (public/jarvis/index.html).
  const navLinks = [
    { name: 'Product', href: '/#today' },
    { name: 'Setup', href: '/#setup' },
    { name: 'Request a call or email', href: '/#start' },
  ]

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Texting', href: '/sms' },
  ]

  // On a phone the sticky "Request a call or email" bar (Header.tsx) lies over the page's foot: pb-32 keeps the last line clear of it.
  const linkClass = 'text-sm text-[#b9b9b9] hover:text-white transition-colors duration-150'
  const headClass = 'text-sm text-[#969696] mb-4'

  return (
    <footer className={`${hostGrotesk.className} bg-[#090909] border-t border-white/10`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-32 md:pb-16 lg:py-20">
        <div className="grid md:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* The name and what it is */}
          <div className="md:col-span-2">
            <a href="/" className="inline-flex items-center gap-2.5 mb-5 text-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/jarvis/assets/brand/mark-purple-white.svg" alt="" width={24} height={24} className="w-6 h-6" />
              <span className="text-lg font-medium tracking-[-0.01em] leading-none">Jarvis</span>
            </a>
            <p className="text-white text-lg leading-snug mb-6 max-w-xs">
              Three hires in one, installed by Omnia AI Intelligence.
            </p>
            <a
              href="mailto:team@getoios.com"
              className="text-sm font-medium text-white underline decoration-white/30 underline-offset-4 hover:decoration-white transition-colors duration-150"
            >
              team@getoios.com
            </a>
          </div>

          {/* Nav Links */}
          <div>
            <h3 className={headClass}>Jarvis</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className={linkClass}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className={headClass}>Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className={linkClass}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#969696] text-xs">
              &copy; 2026 Omnia AI Intelligence. All rights reserved.
            </p>
            <p className="text-[#969696] text-xs">OIOS by Omnia AI Intelligence</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
