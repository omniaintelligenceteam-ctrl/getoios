# Visor hero — local review only

Current branch preview: http://127.0.0.1:3189/jarvis/

Wes selected `keeper-final-owner-approved-v2.mp4` by exact filename after rejecting the old front-start and composite-v3 versions. This hero uses the30.08-second keeper byte-for-byte from `/home/jarvis333/Videos/jarvis-keeper-repair/`, including its existing ending-audio patch. It contains Jarvis pulling the original glass screens forward and moving them. The poster is its first decoded frame. `manifest.json` records the exact source/hash. No video/audio re-encode, new generation, compositing or scene alteration occurred. Older media remain intact as superseded references.

The existing page chrome and sample day remain. The obsolete core3d initializer is disconnected; its sources and models are retained. The three display labels are Right Hand, Back Office and Follow-through. Tap to talk plays the recording with sound; it does not request a microphone or open a live session. At the real end, the final frame stays visible with Replay and Continue. Continue pauses playback. Errors offer Retry and Continue. The sample approval and contact form show preview-only feedback; outgoing links are inactive. CSP blocks connections and form submissions. **Do not publish this review build.**

## Evidence

Run the loopback static server from the existing work directory:

```sh
python /home/jarvis333/Plans/visor-jarvis-stills/astra/work/serve_hero_branch.py --root /home/jarvis333/Projects/getoios/public --port 3189
```

Do not restart it if already running, or disturb AVA's3188/earlier3187 previews.

Browser regression uses the installed Playwright CLI, with open/run/close in one shell session:

```sh
export PLAYWRIGHT_MCP_EXECUTABLE_PATH=/usr/bin/chromium
playwright-cli -s=visor-review open http://127.0.0.1:3189/jarvis/
playwright-cli -s=visor-review --raw run-code --filename=scripts/checks/visor-hero.js
playwright-cli -s=visor-review close
```

Saved proof: `/home/jarvis333/Plans/visor-jarvis-stills/astra/proof/branch-hero-keeper-v2/`.

- `baseline-red.log`: actual browser failed because the current hero did not use the exact keeper v2 selected by Wes.
- `browser-proof.json`:Keeper-specific source/duration check plus playback checks; natural end at30.08s; replay, error/retry, rejected play promise, reduced-motion poster, keyboard start, no mic/socket attempts or nonlocal/static requests.
- `poster-{390,1440,1920,3440}.png`: four viewport layouts, start visible and no horizontal overflow.
- `desktop-playing.png`, `phone-playing.png`, `desktop-ended.png`, `phone-ended.png`, `load-error.png`.
- `media-proof.json`: exact source hashes.

The player preloads metadata but stays paused at zero until activation. An early media error is read during initialization as well as via the error listener, so a missing file immediately exposes Retry. Earlier controller diagnostics remain under `proof/branch-hero/`; they were run with superseded media and are not evidence of keeper acceptance. No buffering state is treated as a live connection.

Scope limits: Chromium browser verification, not a physical iPhone/Safari run. Audio stream and unmuted playback verified; dialogue accuracy, sound quality and sync require AVA/Wes listening review. Generated screen text remains part of this existing review video, not approved readable product UI. This does not implement the future six webpage panels or gated live handoff. Ambition copy is not independently proven public capability. Older core3d checks are preserved as a reference because that opener was superseded; full production/API tests were not run against this static review server.

No paid generation, backend operation, push, merge, deployment or publication. Approved C, corrected Blender staging and historical motion candidates remain untouched.
