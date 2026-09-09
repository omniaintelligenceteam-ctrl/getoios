import type { ElementType, ReactNode } from 'react'

/**
 * Progressive-enhancement reveal wrapper.
 *
 * Renders plain markup with no inline opacity — the hidden state lives in CSS
 * behind `html.js` (see globals.css), which only exists once layout.tsx's boot
 * script has run. So the server HTML is fully visible, and the animation is a
 * bonus for browsers that execute JS.
 *
 * This is deliberately NOT motion/react's `whileInView`: that writes
 * `opacity: 0` into the SSR output, which is what left every section below the
 * hero blank in headless Chromium.
 */
interface RevealProps {
  children: ReactNode
  /** Stagger step, 1–5. Maps to the .reveal-d{n} transition delays. */
  delay?: 1 | 2 | 3 | 4 | 5
  className?: string
  as?: ElementType
}

export function Reveal({ children, delay, className = '', as: Tag = 'div' }: RevealProps) {
  const delayClass = delay ? ` reveal-d${delay}` : ''
  return <Tag className={`reveal${delayClass} ${className}`.trim()}>{children}</Tag>
}
