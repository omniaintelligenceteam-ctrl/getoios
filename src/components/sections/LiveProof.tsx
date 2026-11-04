'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { ArrowUpRight, Play, X } from 'lucide-react'

export function LiveProof() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [mediaError, setMediaError] = useState(false)

  function closeVideo() {
    videoRef.current?.pause()
    triggerRef.current?.focus({ preventScroll: true })
  }

  return (
    <section id="watch" aria-labelledby="watch-heading" className="py-24 lg:py-32 bg-bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-teal-300">See the handoff</span>
          <h2 id="watch-heading" className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white" style={{ fontFamily: 'var(--font-display), sans-serif' }}>A draft you can check.<br /><span className="gradient-text">A decision that stays yours.</span></h2>
          <p className="mt-5 text-slate-300 leading-relaxed">Watch the quote example: supplied prices become a draft, a missing price stays visible, and the owner reviews the result.</p>
        </div>
        <div className="max-w-3xl mx-auto">
          <button ref={triggerRef} type="button" onClick={() => dialogRef.current?.showModal()} className="group relative w-full rounded-2xl border border-slate-600 bg-slate-900 overflow-hidden text-left focus-visible:outline-2 focus-visible:outline-teal-300 focus-visible:outline-offset-4" aria-label="Watch the sample workflow">
            <Image src="/jarvis/assets/proof/jarvis-workflow-poster.png" alt="" width={960} height={1000} className="w-full max-h-[380px] object-cover object-top opacity-70 group-hover:opacity-90 transition-opacity motion-reduce:transition-none" />
            <span className="relative flex items-center gap-4 p-5 sm:p-6 bg-slate-900 border-t border-slate-700">
              <span aria-hidden="true" className="w-12 h-12 rounded-full bg-teal-300 text-slate-950 flex items-center justify-center flex-shrink-0"><Play className="w-5 h-5 ml-0.5" fill="currentColor" /></span>
              <span><span className="block font-semibold text-white">Watch the sample workflow</span><span className="block mt-1 text-sm text-slate-300">15-second website example · silent, with captions</span></span>
            </span>
          </button>
          <p className="mt-4 text-sm text-slate-400 leading-relaxed">Sample job data. Recorded website example, not a connected Jarvis session or a sent customer quote.</p>
        </div>

        <dialog ref={dialogRef} aria-labelledby="sample-video-title" aria-describedby="sample-video-description" onClose={closeVideo} className="m-auto w-[calc(100%_-_24px)] max-w-4xl max-h-[calc(100dvh_-_24px)] overflow-y-auto rounded-2xl border border-slate-600 bg-slate-950 p-0 text-white backdrop:bg-black/80">
          <div className="flex items-start justify-between gap-3 p-4 sm:p-6">
            <div className="min-w-0">
              <h3 id="sample-video-title" className="text-lg sm:text-xl font-semibold">A sample Jarvis workflow</h3>
              <p id="sample-video-description" className="mt-2 text-sm text-slate-300">Recorded website example with sample data; not a connected Jarvis session. Nothing is sent.</p>
            </div>
            <button type="button" autoFocus onClick={() => dialogRef.current?.close()} aria-label="Close sample video" className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-lg border border-slate-600 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-teal-300"><X aria-hidden="true" className="w-5 h-5" /></button>
          </div>
          <video ref={videoRef} aria-label="Sample quote workflow video" controls playsInline preload="none" poster="/jarvis/assets/proof/jarvis-workflow-poster.png" onError={() => setMediaError(true)} className="block w-full max-h-[55dvh] object-contain bg-black">
            <source src="/jarvis/assets/proof/jarvis-workflow.mp4" type="video/mp4" onError={() => setMediaError(true)} />
            <track kind="captions" src="/jarvis/assets/proof/jarvis-workflow.vtt" srcLang="en" label="English" default />
            Your browser cannot play this recording. Read the transcript below.
          </video>
          <div className="p-4 sm:p-6">
            {mediaError && <p role="status" className="mb-4 text-amber-200 text-sm">The recording could not load. You can read the full example below.</p>}
            <details>
              <summary className="min-h-11 flex items-center cursor-pointer text-teal-300 font-medium list-none focus-visible:outline-2 focus-visible:outline-teal-300">Read the transcript and context <span aria-hidden="true" className="ml-2">+</span></summary>
              <div className="mt-3 text-sm text-slate-300 leading-relaxed space-y-3">
                <p>This recording shows the Meet Jarvis website quote example using sample job data. It is an illustration of the handoff, not a connected customer session.</p>
                <p>The example starts with a quote request: two hours of preparation at a sample rate of $95 per hour, one materials kit at $120, and a custom repair with no price supplied.</p>
                <p>The prepared draft shows a priced subtotal of $310. The repair remains unpriced, so the subtotal is not a complete quote. The owner reviews the priced lines, then keeps the example as a draft. The repair remains unpriced throughout, and nothing is sent.</p>
              </div>
            </details>
          </div>
        </dialog>

        <a href="https://meetjarvis.getoios.com" className="group glass-card p-6 sm:p-8 block max-w-3xl mx-auto mt-10 hover:border-amber-400/40 transition-colors">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-300">The assistant we install</span>
          <h3 className="mt-3 text-2xl sm:text-3xl font-bold text-white">Meet Jarvis</h3>
          <p className="mt-4 text-slate-300 leading-relaxed">Explore the same website example, the work Jarvis prepares, and what stays your call.</p>
          <span className="mt-4 inline-flex items-center gap-2 min-h-11 text-amber-300 font-medium">Meet Jarvis <ArrowUpRight aria-hidden="true" className="w-4 h-4" /></span>
        </a>
      </div>
    </section>
  )
}
