# Video hosting — getoios.com

**Why this exists:** Netlify charges $55 per extra 100GB of bandwidth. Video kills bandwidth fast. We host video on **Cloudflare R2** ($0 egress) and embed via the `<Video>` component (`src/components/ui/Video.tsx`). Netlify only ever serves HTML/JS — never the MP4.

## TL;DR for adding a new video

1. Compress the source (see "Compression" below).
2. Upload the MP4 + a poster JPEG to the R2 bucket `getoios-videos`.
3. Drop `<Video src="..." poster="..." />` in the page that needs it. Done.

## One-time Cloudflare setup (Wes, ~10 min)

1. Sign up at [cloudflare.com](https://cloudflare.com) (free).
2. (Optional, recommended) Add `getoios.com` as a CF zone — unlocks the custom domain `videos.getoios.com`.
3. Enable **R2** in the dashboard sidebar.
4. Create bucket `getoios-videos`.
5. Settings → **Public access** → Connect Custom Domain → `videos.getoios.com`. (Or skip and use the auto-assigned `pub-XXXX.r2.dev` URL — both work.)
6. (Optional) Generate an R2 API token and install [wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) for CLI uploads.

## Compression — required before upload

A raw 1080p screen recording can be 200MB/min. Web-compressed 1080p is ~5MB/min. Always compress.

**Standard preset (1080p, web-optimized H.264):**

```bash
ffmpeg -i input.mov \
  -c:v libx264 -preset slow -crf 23 \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  -pix_fmt yuv420p \
  output.mp4
```

**Mobile-first preset (720p, smaller):**

```bash
ffmpeg -i input.mov \
  -vf scale=-2:720 \
  -c:v libx264 -preset slow -crf 24 \
  -c:a aac -b:a 96k \
  -movflags +faststart \
  -pix_fmt yuv420p \
  output-720.mp4
```

`-movflags +faststart` is **mandatory** — it moves the MP4 metadata to the front so video starts playing before fully downloaded.

## Generating a poster image

The poster shows before play and is what users see scrolling past. Make it count.

```bash
# Pull frame at 2 seconds, output 1280px wide JPEG at quality 85
ffmpeg -i output.mp4 -ss 00:00:02 -vframes 1 -vf scale=1280:-2 -q:v 3 poster.jpg
```

Upload `poster.jpg` next to the MP4 in R2.

## File naming convention

- Lowercase, kebab-case, no spaces.
- `<topic>-<variant>.mp4` — e.g., `aios-install-walkthrough.mp4`, `sarah-call-demo-30s.mp4`.
- Poster: same name, `.jpg` — e.g., `aios-install-walkthrough.jpg`.

## Uploading

**Dashboard:** R2 → `getoios-videos` → drag-drop the files. ~2 min.

**CLI (wrangler):**

```bash
wrangler r2 object put getoios-videos/aios-install-walkthrough.mp4 --file ./output.mp4
wrangler r2 object put getoios-videos/aios-install-walkthrough.jpg --file ./poster.jpg
```

## Embedding in a page

```tsx
import { Video } from '@/components/ui/Video'

<Video
  src="https://videos.getoios.com/aios-install-walkthrough.mp4"
  poster="https://videos.getoios.com/aios-install-walkthrough.jpg"
  posterAlt="Wes installing the AI Operating System for a roofing client"
  aspectRatio="16/9"
/>
```

**Props:**

| Prop | Default | Notes |
|---|---|---|
| `src` | required | Full URL to MP4 on R2 |
| `poster` | required | Full URL to poster JPEG on R2 |
| `posterAlt` | `'Video preview'` | Accessibility — describe the still |
| `aspectRatio` | `'16/9'` | `'16/9' \| '9/16' \| '1/1' \| '4/3' \| '21/9'` |
| `autoPlay` | `false` | Mounts immediately, ignores lazy load |
| `loop` | `false` | |
| `muted` | `true` | Required for autoplay on most browsers |
| `controls` | `true` | Native player UI on play |
| `captions` | — | Array of `{ src, label, srcLang, default? }` for VTT tracks |
| `rootMargin` | `'200px'` | How early to mount before viewport entry |

**The component lazy-loads by default** — the `<video>` element doesn't mount until within 200px of viewport. No lazy fetch overhead unless the user scrolls there.

## Future: when to upgrade to Cloudflare Stream

R2 + native `<video>` is plenty for marketing video at this scale. Consider Stream ($5/mo + $1 per 1000 min played) when:

- Mobile users on poor connections start complaining about quality (Stream does adaptive bitrate / HLS automatically).
- You need signed URLs (gated content).
- Storage / playback exceeds 50GB+ of unique content.

The `<Video>` component API is identical for both — only the `src` URL changes.
