import Image from 'next/image'

/**
 * The Jarvis reactor — his face inside a breathing ring.
 *
 * The portrait is lit from the left on near-black, so it composites straight
 * onto the navy field with no cut-out; the ring and glow do the framing.
 * Drawn in CSS rather than 3D on purpose: it renders identically with no JS,
 * costs nothing on mobile, and is the same shape the hero video holds.
 */
interface JarvisOrbProps {
  /** Rendered size in px at the largest breakpoint. */
  size?: number
  className?: string
  /** Solid ring instead of breathing — the read-back state, where nothing moves. */
  locked?: boolean
  priority?: boolean
}

export function JarvisOrb({
  size = 320,
  className = '',
  locked = false,
  priority = false,
}: JarvisOrbProps) {
  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size, maxWidth: '100%' }}
    >
      {/* Outer glow */}
      <div
        aria-hidden="true"
        className={`absolute inset-[-22%] rounded-full pointer-events-none ${
          locked ? '' : 'reactor-breathe'
        }`}
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(111,165,210,0.30) 0%, rgba(45,212,191,0.14) 40%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      {/* Face */}
      <div
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{ boxShadow: 'inset 0 0 60px 12px rgba(11,17,32,0.85)' }}
      >
        <Image
          src="/jarvis/portrait.webp"
          alt="Jarvis"
          fill
          priority={priority}
          sizes="(max-width: 640px) 60vw, 420px"
          className="object-cover object-[50%_28%] scale-[1.18]"
        />
      </div>

      {/* Ring */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          border: locked
            ? '1.5px solid rgba(45,212,191,0.85)'
            : '1.5px solid rgba(111,165,210,0.45)',
          boxShadow: locked
            ? '0 0 26px rgba(45,212,191,0.35), inset 0 0 26px rgba(45,212,191,0.10)'
            : '0 0 22px rgba(111,165,210,0.22), inset 0 0 22px rgba(111,165,210,0.08)',
        }}
      />

      {/* Hairline arc — a second ring, offset, to read as instrumentation */}
      <div
        aria-hidden="true"
        className="absolute inset-[-6%] rounded-full"
        style={{
          border: '1px solid rgba(148,163,184,0.14)',
          borderTopColor: 'rgba(45,212,191,0.45)',
        }}
      />
    </div>
  )
}
