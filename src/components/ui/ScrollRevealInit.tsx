'use client'

import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap-init'

/**
 * Global scroll reveal enhancer.
 * Adds subtle parallax and fade effects to section elements
 * that already have their own animations — this layer adds depth, not replaces.
 */
export function ScrollRevealInit() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Small delay to let initial page animations settle
    const timeout = setTimeout(() => {
      // Add subtle parallax to all sections
      const sections = document.querySelectorAll('section')
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { scale: 0.985 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'top 20%',
              scrub: true,
            },
          }
        )
      })

      // Enhance glass-cards with staggered reveal
      const cardGroups = document.querySelectorAll('.grid, .flex')
      cardGroups.forEach((group) => {
        const cards = group.querySelectorAll('.glass-card')
        if (cards.length < 2) return

        cards.forEach((card, i) => {
          const el = card as HTMLElement
          // Only enhance cards that don't already have GSAP triggers
          if (el.dataset.gsapEnhanced) return
          el.dataset.gsapEnhanced = 'true'

          gsap.fromTo(
            el,
            { y: 20, opacity: 0.6 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              delay: i * 0.08,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none none',
              },
            }
          )
        })
      })
    }, 2000) // Wait for page entrance to finish

    return () => {
      clearTimeout(timeout)
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return null
}
