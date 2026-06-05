import { Video } from '@/components/ui/Video'

export const metadata = {
  title: 'Video component test (internal)',
  robots: { index: false, follow: false },
}

const SAMPLE_SRC = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
const SAMPLE_POSTER = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1280&q=80'

export default function VideoTestPage() {
  return (
    <main className="min-h-screen bg-bg-primary px-4 py-24 text-white">
      <div className="mx-auto max-w-4xl space-y-16">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold">Video component — internal QA</h1>
          <p className="text-text-muted">
            Verifies lazy mount, poster, play overlay, and that bytes pull from the configured CDN
            (not Netlify). Delete this page before merge to main.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">1. Default 16:9 lazy</h2>
          <p className="text-sm text-text-muted">
            Video element should NOT mount until within 200px of viewport. Watch the Network tab.
          </p>
          <Video src={SAMPLE_SRC} poster={SAMPLE_POSTER} posterAlt="Sample video poster" />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">2. Vertical 9:16 (Reels-style)</h2>
          <Video
            src={SAMPLE_SRC}
            poster={SAMPLE_POSTER}
            aspectRatio="9/16"
            className="mx-auto max-w-sm"
          />
        </section>

        {/* Spacer to test that videos far down the page DO NOT prefetch */}
        <div className="h-[120vh] rounded-2xl border border-dashed border-white/10 p-8">
          <p className="text-text-muted">
            ↓ Scroll down — the video below should only mount once it&apos;s within 200px of viewport.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">3. Below-the-fold lazy proof</h2>
          <Video src={SAMPLE_SRC} poster={SAMPLE_POSTER} />
        </section>
      </div>
    </main>
  )
}
