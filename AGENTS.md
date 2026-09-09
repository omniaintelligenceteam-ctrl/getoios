# OIOS Voice Agent Project

## Project overview

OIOS is the customer-facing voice-agent and business-automation product for service businesses. The main app is a Next.js 16 App Router project deployed at `getoios.com`. It includes live voice demos, lead-capture flows, scheduling, transactional email, and supporting webhook/operations tooling.

## Repository map

- `src/app/` — pages and API routes.
- `src/components/` — reusable UI and page sections.
- `src/lib/` — shared rate limiting, sanitization, Supabase operations, and utilities.
- `src/hooks/` — client hooks.
- `tests/` — Playwright page, form, API, accessibility, and performance coverage.
- `webhook/` — separate Node.js webhook/listener service with its own package manifest.
- `tools/` — internal operations and lead-generation scripts.
- `docs/` and `prep/` — product, sales, and feature documentation.

## Local commands

- Install dependencies: `npm install`
- Start the app: `npm run dev`
- Lint: `npm run lint`
- Production build: `npm run build`
- Playwright suite: `npm test`
- Interactive Playwright: `npm run test:ui`

The main app runs at `http://localhost:3000` by default. Copy `.env.example` to `.env.local` and provide only the credentials needed for the feature being exercised.

## Working agreements

- Preserve the Next.js App Router and TypeScript conventions already in the repository.
- Keep public API inputs rate-limited and sanitized using the helpers in `src/lib/`.
- Never commit `.env.local`, credentials, tokens, customer data, call logs, or webhook payloads containing personal information.
- Do not expose server-only credentials through `NEXT_PUBLIC_*` variables.
- Add external image hosts to `next.config.ts` before using them with `next/image`.
- Reuse existing components and motion patterns before adding a new UI abstraction or dependency.
- Keep customer-facing copy direct and specific. Do not invent pricing, customer claims, metrics, or integration capabilities.
- Preserve unrelated local changes and generated artifacts unless the task explicitly includes them.

## Verification

- For focused changes, run the closest relevant test plus `npm run lint`.
- For changes affecting routing, configuration, dependencies, or production behavior, also run `npm run build`.
- For customer journeys or interactive UI changes, run the relevant Playwright spec.
- Report checks that could not run because a credential or external service is unavailable.

## Deployment

Vercel deploys the `main` branch. Treat pushes to `main` as production-impacting and do not deploy, push, or rotate credentials unless the user explicitly requests it.
