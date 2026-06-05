'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { cn } from '@/lib/utils'

type AspectRatio = '16/9' | '9/16' | '1/1' | '4/3' | '21/9'

interface VideoCaption {
  src: string
  label: string
  srcLang: string
  default?: boolean
}

interface VideoProps {
  src: string
  poster: string
  posterAlt?: string
  className?: string
  aspectRatio?: AspectRatio
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
  captions?: VideoCaption[]
  rootMargin?: string
  children?: ReactNode
}

const aspectClass: Record<AspectRatio, string> = {
  '16/9': 'aspect-video',
  '9/16': 'aspect-[9/16]',
  '1/1': 'aspect-square',
  '4/3': 'aspect-[4/3]',
  '21/9': 'aspect-[21/9]',
}

export function Video({
  src,
  poster,
  posterAlt = 'Video preview',
  className,
  aspectRatio = '16/9',
  autoPlay = false,
  loop = false,
  muted = true,
  controls = true,
  captions,
  rootMargin = '200px',
  children,
}: VideoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [shouldMount, setShouldMount] = useState(autoPlay)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (autoPlay) return
    const el = containerRef.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      setShouldMount(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldMount(true)
          observer.disconnect()
        }
      },
      { rootMargin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [autoPlay, rootMargin])

  const handlePlay = () => {
    const v = videoRef.current
    if (!v) {
      setShouldMount(true)
      return
    }
    if (v.paused) {
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }

  const handleKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      handlePlay()
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full overflow-hidden rounded-2xl bg-black',
        aspectClass[aspectRatio],
        className
      )}
    >
      {/* Poster — always rendered behind the video so there's no flash */}
      <Image
        src={poster}
        alt={posterAlt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1280px"
        className={cn(
          'object-cover transition-opacity duration-500',
          isPlaying ? 'opacity-0' : 'opacity-100'
        )}
        priority={autoPlay}
      />

      {shouldMount && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          controls={controls && isPlaying}
          playsInline
          preload="none"
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
            isPlaying ? 'opacity-100' : 'opacity-0'
          )}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        >
          {captions?.map((c) => (
            <track
              key={c.src}
              kind="captions"
              src={c.src}
              srcLang={c.srcLang}
              label={c.label}
              default={c.default}
            />
          ))}
        </video>
      )}

      {!isPlaying && (
        <button
          type="button"
          onClick={handlePlay}
          onKeyDown={handleKey}
          aria-label="Play video"
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 transition hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-black/40 backdrop-blur-md transition-transform duration-300 group-hover:scale-110 hover:scale-110">
            <Play className="ml-1 h-8 w-8 fill-white text-white" />
          </span>
        </button>
      )}

      {children && <div className="absolute inset-x-0 bottom-0 z-20">{children}</div>}
    </div>
  )
}
