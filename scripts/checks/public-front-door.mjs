// Reject review-only guards in the public document before publishing.
// Pass a saved HTTP response path to check the served index as well.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const path = process.argv[2] || fileURLToPath(new URL('../../public/jarvis/index.html', import.meta.url));
const html = readFileSync(path, 'utf8');
const forbidden = [
  [/noindex/i, 'noindex prevents public indexing'],
  [/data-local-preview/i, 'data-local-preview marks the public page as a review build'],
  [/local\s+preview/i, 'Local preview wording must not ship on the index page'],
  [/(?:connect-src|form-action)\s+'none'/i, 'CSP blocks the existing request path'],
  [/preview-notice|data-preview-link|data-preview-request/i, 'Preview guards replace public links or requests'],
];
const failures = forbidden.filter(([pattern]) => pattern.test(html)).map(([, reason]) => reason);
if (failures.length) {
  console.error(failures.map(reason => `FAIL: ${reason}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`PASS: ${forbidden.length} public front-door checks (${path})`);
}
