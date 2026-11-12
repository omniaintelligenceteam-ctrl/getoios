// Check the public front door before it ships.
// 1. Reject review-only guards (noindex, preview notices, a CSP that blocks the form).
// 2. Hold the page to what the server needs: absolute paths, because the page is
//    served at "/" by a rewrite, and the /api/handoff form contract.
// Pass a saved HTTP response path to check the served index as well.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const path = process.argv[2] || fileURLToPath(new URL('../../public/jarvis/index.html', import.meta.url));
const html = readFileSync(path, 'utf8');

const forbidden = [
  [/noindex/i, 'noindex prevents public indexing'],
  [/data-local-preview/i, 'data-local-preview marks the public page as a review build'],
  [/local\s+preview/i, 'Local preview wording must not ship on the index page'],
  [/design mock/i, 'Design mock wording must not ship on the index page'],
  [/(?:connect-src|form-action)\s+'none'/i, 'CSP blocks the existing request path'],
  [/preview-notice|data-preview-link|data-preview-request/i, 'Preview guards replace public links or requests'],
  [/(?:src|href|srcset|poster)="(?!\/|#|https:\/\/|mailto:)/i, 'A relative path breaks when the page is served at /'],
];

const form = (html.match(/<form\b[^>]*>[\s\S]*?<\/form>/i) || [''])[0];
const formTag = (form.match(/<form\b[^>]*>/i) || [''])[0];
// Wes, 10 Nov 2026: the form asks for a name, an industry, an email and a cell. Nothing else shows.
const visible = [...form.matchAll(/<(?:input|textarea|select)\b[^>]*>/gi)]
  .map((m) => m[0])
  .filter((tag) => !/type="hidden"/.test(tag) && !/name="company"/.test(tag))
  .map((tag) => (tag.match(/name="([^"]+)"/) || [])[1]);
const required = [
  [/<link rel="canonical" href="https:\/\/getoios\.com\/">/.test(html), 'The canonical address is https://getoios.com/'],
  [/action="\/api\/handoff"/.test(formTag) && /method="post"/i.test(formTag), 'The form posts to /api/handoff'],
  [visible.join(',') === 'fullName,industry,email,phoneNumber', `The form shows fullName, industry, email, phoneNumber and nothing else (found: ${visible.join(',') || 'none'})`],
  ...['interest', 'company'].map((name) => [
    new RegExp(`<input\\b[^>]*name="${name}"`).test(form),
    `The form has the unseen ${name} field`,
  ]),
  [/id="sent"/.test(form), 'The form has the #sent confirmation that the no-script path lands on'],
];

const failures = [
  ...forbidden.filter(([pattern]) => pattern.test(html)).map(([, reason]) => reason),
  ...required.filter(([ok]) => !ok).map(([, reason]) => `Missing: ${reason}`),
];
if (failures.length) {
  console.error(failures.map((reason) => `FAIL: ${reason}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`PASS: ${forbidden.length + required.length} public front-door checks (${path})`);
}
