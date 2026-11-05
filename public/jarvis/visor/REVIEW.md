# Visor hero and public front door

Wes selected `keeper-final-owner-approved-v2.mp4` by exact filename after rejecting the front-start and composite-v3 versions. The hero uses the 30.08-second keeper byte-for-byte, including its existing ending-audio patch. Jarvis pulls the original glass screens forward and moves them. The poster is its first decoded frame; `manifest.json` records both hashes. The public-front-door repair does not change either media file.

Tap to talk plays the recording with sound. It does not request a microphone or open a live session. At the natural end, the final decoded frame stays visible with Replay and Continue. Continue pauses playback. Load/play failures offer Retry. The sample-day approval remains a demonstration that sends nothing. Request a call is the separate, real contact form.

## Baseline restored after PR #12

PR #12 merged as `11435136d3ce266f190ec2109bb1bdaabe5bd76a`. Its first parent, `e7a93cbbf74f90cf0823f59d9fbd3a49e107a0a4`, is the pre-merge main used for this repair.

That main had:

- No `noindex` robots meta and no page-level CSP. `public/robots.txt` allowed crawling. Removing the review-added CSP restores that baseline; the existing platform security headers remain unchanged.
- A `POST /api/handoff` form with required pillar, first handoff, name and phone fields. Its original JavaScript validates, sends JSON, displays server errors with retry, and focuses the success message. Without JavaScript, it submits URL-encoded fields; the API redirects to `/#sent` on success or `/#start` on validation failure.
- An existing API that validates and rate-limits requests, checks the company honeypot, and uses Resend to email the team inbox. The API is unchanged. Actual delivery requires the deployment's existing `RESEND_API_KEY` and a successful Resend response. No credentials were inspected and no real lead was sent during this repair; live inbox delivery is not verified by these tests.
- Real `/features`, `/how-it-works`, `/pricing`, `/about`, `/privacy`, `/terms`, `/sms`, `https://meetjarvis.getoios.com` and `mailto:team@getoios.com` destinations. The three information links and home link are also restored from that parent.

The review label, notice/interception handlers, inactive form, indexing block and manifest publication restriction are removed. The recording remains identified truthfully and the header still says Not listening. This repair is a PR for Wes to merge; it does not implement live conversation, new product features or the future webpage-controlled panels.

## Reproduce the checks

Use a real Next production server: the old static review server deliberately blocks connections and form submissions, so it cannot verify the restored path. From this checkout:

```sh
node scripts/checks/public-front-door.mjs
npx --no-install tsc --noEmit
npm run build
RESEND_API_KEY='' npm run start -- --hostname 127.0.0.1 --port 3190
```

With that test server running, run the following in a second shell. Keep open/run/close together; use an unused session name. Browser success/error submissions are intercepted at `/api/handoff`, with synthetic visitor details, so they never email anyone.

```sh
mkdir -p test-results/visor-hero
export PLAYWRIGHT_MCP_EXECUTABLE_PATH=/usr/bin/chromium
playwright-cli -s=visor-public open http://127.0.0.1:3190/
playwright-cli -s=visor-public --raw run-code --filename=scripts/checks/visor-hero.js
playwright-cli -s=visor-public close
```

The browser suite checks the served index and CSP, exact keeper source, keyboard start, full playback/end, replay, Continue, four viewport layouts, load failure/retry, reduced motion and blocked playback. It also exercises empty-form validation, error/retry, JSON submission and confirmation, original link destinations and actual local navigation, and native form submission with JavaScript disabled. It checks that the recording makes no mic or live-connection attempt. Screenshots go to `test-results/visor-hero/` relative to the CLI working directory.

The static guard rejects `noindex`, `data-local-preview`, `Local preview`, disabled connection/form CSP and preview link/request guards. It also accepts a saved HTTP response file path, to check what the server actually returns. It was run against the broken index before making the repair.

Repair verification: 30/30 browser checks, typecheck and production build passed. The five-part public guard failed on the original index and passed on both the repaired file and the served `/` response. An empty JSON request to the real local API returned 400 with the expected missing-pillar error. Evidence and screenshots are saved under `~/Plans/visor-jarvis-stills/astra/proof/public-front-door-restore/`.

Scope of proof: Chromium at desktop and 390px phone width, not a physical iPhone/Safari run. Tests verify playback and decoded frames, not dialogue or sound quality. Intercepted browser submissions prove the frontend contract, not Resend delivery. The backend and deployment/header configuration are byte-identical to pre-merge main.
