import { test, expect, type Page } from '@playwright/test'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Wes, 2 Nov 2026: Jarvis is sold as the owner's chief of staff. Jarvis
 * answering a business's customers' calls is not sold or shown anywhere.
 * The Front Desk is customer messages, with the reply drafted in the owner's
 * voice and sent on his tap.
 *
 * This spec reads every surface a visitor or a crawler reads on every route
 * and fails on a call-answering claim. Bare "call" and "phone" are allowed on
 * purpose: the owner's own calls, his phone as his channel to Jarvis, a human
 * on a phone in a photograph, "the call stays yours".
 */
export const CALL_CLAIMS =
  /\b(incoming calls?|answers? (?:the|your|our) (?:phones?|calls?)|answer(?:ing)? (?:the|your|our) (?:phones?|calls?)|answers? calls|handl(?:e|es|ing) (?:your |inbound |all )?calls|runs? (?:your )?phones|call answering|calls? answered|phones answered|callers?|missed calls?|ai receptionist|voice receptionist|receptionist|answering service|after[- ]hours|voicemail|24\/7|every call|every ring|never miss a call|text-back)\b/i

/**
 * Wes: OIOS is for every small business, never for the trades only. A page
 * that addresses contractors or the trades as the whole audience fails. One
 * trade as one sample among others (the plumbing day) is allowed.
 */
export const AUDIENCE_CLAIMS =
  /\b(every contractor|for contractors|contractors like you|built for (?:the )?trades|for the trades|trades? businesses only|home[- ]service (?:business(?:es)?|pros?|companies))\b/i

const RULES = [CALL_CLAIMS, AUDIENCE_CLAIMS]

/** Every banned phrase in a text, under either rule. */
function claims(text: string): string[] {
  return RULES.flatMap((rule) => text.match(new RegExp(rule.source, 'gi')) || [])
}

/**
 * Every page under src/app, read off disk, so a new or forgotten page cannot
 * stay outside this spec (/demo-saas did, 2 to 12 Nov 2026). `/` is the static
 * front door (next.config.ts rewrite); every old page address redirects to it.
 */
function pageRoutes(dir = join(process.cwd(), 'src', 'app'), route = ''): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isFile()) return /^page\.(tsx|ts|jsx|js)$/.test(entry.name) ? [route || '/'] : []
    if (!entry.isDirectory() || entry.name === 'api' || /^[_\[@]/.test(entry.name)) return []
    const group = /^\(.*\)$/.test(entry.name)
    return pageRoutes(join(dir, entry.name), group ? route : `${route}/${entry.name}`)
  })
}

const ROUTES = [...new Set(['/', ...pageRoutes()])].sort()

/** The business switch on / rewrites the whole sample day, so each day is read. */
const SAMPLE_DAYS = ['cafe', 'dental', 'shop', 'plumbing']

type Surface = { surface: string; text: string }

/** Everything on the page a reader or a crawler can see, hidden text included. */
async function readSurfaces(page: Page): Promise<Surface[]> {
  return page.evaluate(() => {
    const out: { surface: string; text: string }[] = []
    const body = document.body.cloneNode(true) as HTMLElement
    body.querySelectorAll('script, style, noscript').forEach((el) => el.remove())
    out.push({ surface: 'title', text: document.title })
    out.push({ surface: 'body text', text: body.textContent || '' })
    document.querySelectorAll('img[alt]').forEach((img, i) => {
      out.push({ surface: `img alt #${i + 1}`, text: img.getAttribute('alt') || '' })
    })
    document
      .querySelectorAll('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"], meta[name="keywords"]')
      .forEach((meta) => {
        out.push({ surface: `meta ${meta.getAttribute('name') || meta.getAttribute('property')}`, text: meta.getAttribute('content') || '' })
      })
    document.querySelectorAll('script[type="application/ld+json"]').forEach((script, i) => {
      out.push({ surface: `json-ld #${i + 1}`, text: script.textContent || '' })
    })
    document.querySelectorAll('textarea[placeholder], input[placeholder]').forEach((el) => {
      out.push({ surface: `placeholder ${el.getAttribute('name') || ''}`, text: el.getAttribute('placeholder') || '' })
    })
    return out
  })
}

test.describe('No call-answering claims', () => {
  for (const route of ROUTES) {
    test(`${route} sells a chief of staff, not a receptionist`, async ({ page }) => {
      await page.goto(route)
      await page.waitForLoadState('networkidle')
      if (route === '/') await expect(page.locator('html[data-ready]')).toHaveCount(1, { timeout: 15_000 })
      // client-rendered scenes start when scrolled into view and type their lines over a few seconds
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(1_000)
      await page.evaluate(() => window.scrollTo(0, 0))

      const found = (await readSurfaces(page)).flatMap(({ surface, text }) => {
        return claims(text).map((hit) => `${surface}: "${hit}"`)
      })
      expect(found).toEqual([])
    })
  }

  for (const day of SAMPLE_DAYS) {
    test(`/ sample day "${day}", approved or declined, makes no call-answering claim`, async ({ page }) => {
      await page.goto('/')
      await expect(page.locator('html[data-ready]')).toHaveCount(1, { timeout: 15_000 })
      await page.locator(`input[name="biz"][value="${day}"]`).check()
      await page.waitForTimeout(400)
      const found: string[] = []
      for (const tap of ['data-approve', 'data-decline']) {
        for (const scene of ['s1', 's2', 's3']) await page.locator(`[data-scene="${scene}"] [${tap}]`).click()
        for (const { surface, text } of await readSurfaces(page)) {
          for (const hit of claims(text)) found.push(`${tap} ${surface}: "${hit}"`)
        }
        for (const scene of ['s1', 's2', 's3']) await page.locator(`[data-scene="${scene}"] [data-undo]`).click()
      }
      expect(found).toEqual([])
    })
  }

  test('/llms.txt, the summary for AI crawlers, makes no call-answering claim', async ({ request }) => {
    const response = await request.get('/llms.txt')
    expect(response.status()).toBe(200)
    expect(claims(await response.text())).toEqual([])
  })

  test('the route list covers every page in src/app', () => {
    for (const route of ['/', '/privacy', '/terms', '/sms']) expect(ROUTES).toContain(route)
    expect(ROUTES).toEqual([...new Set(['/', ...pageRoutes()])].sort())
    expect(ROUTES.length).toBeGreaterThanOrEqual(5)
  })

  test('the rules catch the sentence the deleted /demo-saas page carried', () => {
    expect(claims('Every contractor has the same leaks: missed calls, slow follow-ups')).toEqual(['missed calls', 'Every contractor'])
  })
})
