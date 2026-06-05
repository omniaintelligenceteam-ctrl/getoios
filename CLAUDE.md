# getoios — OIOS marketing site (getoios.com)

The OIOS marketing website. Next.js 16 (App Router) · React 19 · TypeScript 5.9 · Tailwind v4. Animations via `motion` + GSAP. Integrations: Retell (live voice demo), Resend (email), Gemini (chat demo), ElevenLabs (TTS), Cal.com (scheduling). See `README.md` for the full stack, env vars, and API-route table.

## Layout
- `src/app/` — App Router pages (`page.tsx`, `about/`, `pricing/`, `features/`, `solutions/`, etc.) and `api/` (7 routes: retell, form, audit, demo-request, chat, elevenlabs, calcom).
- `src/components/` — React components. `src/lib/` — utilities (rate-limit, sanitize). `src/hooks/` — hooks.
- `public/` — static assets.

## Commands
- `npm run dev` — dev server at http://localhost:3000
- `npm run build` — production build (run before pushing)
- `npm test` — Playwright tests (covers pages + API routes); `npm run test:ui` to debug
- `npm run lint` — ESLint

## Gotchas
- **Deploy = Vercel auto-deploy from `main`.** Manual: `npx vercel --prod`. Vercel project `getoios` (team `omniaintelligenceai`); repo `omniaintelligenceteam-ctrl/silent-ai-partner`. Account for build lag + CDN cache before calling a change live.
- Env vars live in `.env.local` (values in `reference_access_credentials.md`); never commit secrets.
- Every API route must keep its rate limiting + input sanitization (`src/lib/`).
- `next.config.ts` whitelists remote image hosts (unsplash, videos.getoios.com, `*.r2.dev`, R2). New external image sources must be added there or `next/image` will throw.

## Brand & copy
This is customer-facing OIOS surface — follow brand-voice + anti-AI-tells rules from the global CLAUDE.md before editing any visible copy. Never reference pricing numbers; tier names are capability levels only.
