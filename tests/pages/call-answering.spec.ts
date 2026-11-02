import { test, expect, type Page } from '@playwright/test'

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

const ROUTES = ['/', '/features', '/how-it-works', '/solutions', '/pricing', '/about', '/form', '/privacy', '/terms']

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
      if (route === '/') await expect(page.locator('html')).toHaveClass(/sc-ready/, { timeout: 15_000 })
      // client-rendered scenes start when scrolled into view and type their lines over a few seconds
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await page.waitForTimeout(route === '/how-it-works' ? 8_000 : 1_000)
      await page.evaluate(() => window.scrollTo(0, 0))

      const found = (await readSurfaces(page)).flatMap(({ surface, text }) => {
        const hits = text.match(new RegExp(CALL_CLAIMS.source, 'gi')) || []
        return hits.map((hit) => `${surface}: "${hit}"`)
      })
      expect(found).toEqual([])
    })
  }
})
