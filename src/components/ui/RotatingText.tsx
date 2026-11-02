'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface RotatingTextProps {
  phrases: string[]
  className?: string
  interval?: number
}

export function RotatingText({ phrases, className, interval = 3000 }: RotatingTextProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length)
    }, interval)

    return () => clearInterval(id)
  }, [phrases.length, interval])

  return (
    <span className="inline-block align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          className={`inline-block ${className ?? ''}`}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
