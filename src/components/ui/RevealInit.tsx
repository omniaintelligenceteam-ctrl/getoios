'use client'

import { useEffect } from 'react'

/**
 * Drives the `.reveal` → `.is-visible` transition.
 *
 * Every escape hatch here exists because the failure mode is an invisible page:
 * no IntersectionObserver, an observer that never fires, or a reveal added
 * after the first sweep all end with everything shown rather than nothing.
 */
export function RevealInit() {
  useEffect(() => {
    const show = (el: Element) => el.classList.add('is-visible')
    const showAll = () => document.querySelectorAll('.reveal').forEach(show)

    if (typeof IntersectionObserver === 'undefined') {
      showAll()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          show(entry.target)
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 }
    )

    const observeAll = () => {
      document
        .querySelectorAll('.reveal:not(.is-visible)')
        .forEach((el) => observer.observe(el))
    }

    observeAll()

    // Sections mounted after hydration (route changes, lazy content) still get picked up.
    const mutations = new MutationObserver(observeAll)
    mutations.observe(document.body, { childList: true, subtree: true })

    // Last resort: if anything is still hidden after the page has settled, show it.
    const failsafe = window.setTimeout(showAll, 3000)

    return () => {
      window.clearTimeout(failsafe)
      mutations.disconnect()
      observer.disconnect()
    }
  }, [])

  return null
}
