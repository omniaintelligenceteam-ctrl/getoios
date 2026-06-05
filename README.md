# OIOS by Omnia Intelligence AI

AI receptionist and business automation platform for service businesses. Live at [getoios.com](https://getoios.com).

---

## Tech Stack

- **Next.js 16** with App Router
- **React 19**
- **TypeScript 5.9**
- **Tailwind CSS v4**
- **Framer Motion** (via `motion` package) + **GSAP** for animations
- **Resend** for transactional email
- **Retell Client SDK** for live voice demo
- **ElevenLabs** for text-to-speech
- **Cal.com** embed for scheduling

## Setup

```bash
npm install
npm run dev
```

Site runs at `http://localhost:3000`.

### Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm start            # Start production server
npm run lint         # ESLint
npm test             # Playwright tests (141 tests)
npm run test:ui      # Playwright with interactive UI
npm run test:report  # View last test report
```

## Environment Variables

Create `.env.local` in the project root. Required variables (values in `reference_access_credentials.md`):

```
RETELL_API_KEY
RESEND_API_KEY
GEMINI_API_KEY
ELEVENLABS_API_KEY
NEXT_PUBLIC_CALCOM_LINK
CALCOM_WEBHOOK_SECRET
DISCORD_WEBHOOK_ALERTS
```

## API Routes

All routes are under `src/app/api/`. Every route includes rate limiting and input sanitization.

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/retell` | POST | Create Retell web call sessions for the live voice demo |
| `/api/form` | POST | Contact form submissions, sends notification via Resend |
| `/api/audit` | POST | Audit request form, sends email via Resend |
| `/api/demo-request` | POST | Demo request form, sends email via Resend |
| `/api/chat` | POST | Text chat demo powered by Gemini AI |
| `/api/elevenlabs` | POST | Text-to-speech conversion for site voice demo |
| `/api/calcom` | POST | Webhook receiver for Cal.com scheduling events |

## Tests

141 Playwright tests covering all pages and API routes.

```bash
# Run all tests
npm test

# Run with UI for debugging
npm run test:ui

# View HTML report from last run
npm run test:report
```

## Deployment

Deployed on **Vercel** with automatic deploys from the `main` branch.

- **Production URL:** https://getoios.com
- **Vercel project:** omniaintelligenceai/getoios
- **GitHub repo:** omniaintelligenceteam-ctrl/silent-ai-partner

```bash
# Manual deploy
npx vercel --prod

# Test build locally before pushing
npm run build
```

## Project Structure

```
src/
  app/
    api/           # 7 API routes (retell, form, audit, demo-request, chat, elevenlabs, calcom)
    page.tsx       # Main landing page
    layout.tsx     # Root layout
  components/      # React components
  lib/             # Utilities (rate-limit, sanitize)
```

## License

Proprietary. Omnia Intelligence AI.
