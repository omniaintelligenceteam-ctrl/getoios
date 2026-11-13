import { test, expect, type Page } from '@playwright/test'

/**
 * The front door. `/` is the static page in public/jarvis, served by the
 * rewrite in next.config.ts. Wes, 12 Nov 2026: Jarvis is three hires in one,
 * an assistant for your business and your life, a chief of staff and a full
 * management team. The page says that first, shows each hire in its own
 * section, and lets the visitor approve or decline three sample items.
 * door.js marks <html data-ready> once the page has booted.
 *
 * No test here lets a form post reach the server: each one answers
 * /api/handoff itself, because a real post emails the team inbox.
 */
const ready = (page: Page) => expect(page.locator('html[data-ready]')).toHaveCount(1, { timeout: 15_000 })
type Scene = 's1' | 's2' | 's3'
const card = (page: Page, scene: Scene) => page.locator(`#today [data-item="${scene}"]`)
const row = (page: Page, scene: Scene) => page.locator(`#today [data-row="${scene}"]`)
const pick = (page: Page, scene: Scene) => page.locator(`#today [data-pick="${scene}"]`).click()

const SECTIONS = ['today', 'assistant', 'chief', 'team', 'tools', 'rule', 'setup', 'behind', 'questions', 'start']

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
  })

  // ─── Page load ───────────────────────────────────────────────────────
  test('loads with the three-hire title', async ({ page }) => {
    await expect(page).toHaveTitle('Jarvis: three hires in one for small-business owners')
  })

  test('returns 200 status', async ({ page }) => {
    const response = await page.goto('/')
    expect(response!.status()).toBe(200)
  })

  test('the page boots and is open to search engines', async ({ page }) => {
    await ready(page)
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://getoios.com/')
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /assistant for your business and your life, your chief of staff, and your full management team/)
  })

  // ─── First screen ────────────────────────────────────────────────────
  test('the one h1 says Jarvis is three hires in one', async ({ page }) => {
    const h1 = page.locator('h1#hero-h')
    await expect(h1).toBeVisible()
    await expect(h1).toHaveText('Jarvis is three hires in one')
    await expect(page.locator('h1')).toHaveCount(1)
    const lead = page.locator('.hero .hero__lead')
    for (const hire of ['assistant for your business and your life', 'chief of staff', 'full management team']) {
      await expect(lead).toContainText(hire)
    }
  })

  test('the first screen shows the three hires and nothing of the next section', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await ready(page)
    const sets = page.locator('.hero .ly-collage__set')
    await expect(sets).toHaveCount(3)
    await expect(page.locator('.hero .pc-hire strong')).toHaveText(['Assistant', 'Chief of staff', 'Management team'])
    const next = await page.locator('#today').boundingBox()
    expect(next!.y).toBeGreaterThanOrEqual(899)
    // every picture in the first set has drawn
    for (const img of await sets.first().locator('img').all()) {
      await expect.poll(() => img.evaluate((el) => (el as HTMLImageElement).naturalWidth), { timeout: 10_000 }).toBeGreaterThan(0)
    }
  })

  test('the bar names Jarvis and carries the one action', async ({ page }) => {
    const header = page.locator('header.nav')
    await expect(header.locator('a.nav__logo')).toContainText('Jarvis')
    await expect(header.locator('.nav__actions a.btn')).toHaveText('Request a call')
    await expect(header.locator('.nav__actions a.btn')).toHaveAttribute('href', '#start')
  })

  test('every section is on the page and every link on it lands on one', async ({ page }) => {
    for (const id of SECTIONS) await expect(page.locator(`section#${id}`)).toHaveCount(1)
    const targets = await page.locator('a[href^="#"]').evaluateAll((links) => [...new Set(links.map((a) => a.getAttribute('href')!.slice(1)))])
    expect(targets.length).toBeGreaterThan(8)
    for (const id of targets) await expect(page.locator(`[id="${id}"]`), `#${id}`).toHaveCount(1)
  })

  test('the bar marks the section on screen', async ({ page }) => {
    await ready(page)
    const current = () => page.locator('header .nav__link[aria-current="location"]')
    await expect(current()).toHaveCount(0)
    for (const [section, link] of [['chief', '#today'], ['setup', '#setup'], ['rule', '#tools'], ['questions', '#questions']]) {
      await page.locator(`#${section}`).evaluate((el) => el.scrollIntoView())
      await expect(current()).toHaveCount(1)
      await expect(current()).toHaveAttribute('href', link)
    }
    await page.locator('#start').evaluate((el) => el.scrollIntoView())
    await expect(current()).toHaveCount(0)
  })

  // The page before this one had sections #day, #pm, #night, #work and #install. Links to them are out
  // in emails and on meetjarvis.getoios.com, so each one lands on the section that took its place.
  for (const [old, now] of [['day', 'today'], ['pm', 'today'], ['night', 'chief'], ['work', 'assistant'], ['install', 'setup']]) {
    test(`an old link to /#${old} opens #${now}`, async ({ page }) => {
      await page.goto('about:blank')
      await page.goto(`/#${old}`)
      await ready(page)
      await expect.poll(() => new URL(page.url()).hash).toBe(`#${now}`)
      await expect(page.locator(`section#${now}`)).toBeInViewport()
    })
  }

  test('an old section link followed on the page itself opens the new section too', async ({ page }) => {
    await ready(page)
    await page.evaluate(() => { location.hash = '#install' })
    await expect.poll(() => new URL(page.url()).hash).toBe('#setup')
    await expect(page.locator('section#setup')).toBeInViewport()
  })

  test('each hire has its own section, named in the owner’s words', async ({ page }) => {
    await expect(page.locator('#assistant h2')).toContainText('assistant for business and life')
    await expect(page.locator('#assistant')).toContainText('everything runs smoothly and stays organized')
    await expect(page.locator('#chief h2')).toContainText('chief of staff')
    await expect(page.locator('#chief h2')).toContainText('brings you only what needs you')
    await expect(page.locator('#team h2')).toContainText('full management team')
    await expect(page.locator('#team h2')).toContainText('The money, the sales, the customers and the paperwork get done')
    await expect(page.locator('#team article h3')).toHaveCount(4)
    for (const id of ['money', 'sales', 'customers', 'paperwork']) await expect(page.locator(`#team article#${id}`)).toHaveCount(1)
  })

  test('the rule is stated once, in full', async ({ page }) => {
    await expect(page.locator('#rule h2')).toHaveText('Nothing without your tap')
    await expect(page.locator('#rule')).toContainText('Nothing is spent, sent or deleted until you approve it')
  })

  // ─── The live list ───────────────────────────────────────────────────
  test('the list says it is a sample, so no visitor thinks a tap sends a real message', async ({ page }) => {
    await ready(page)
    await expect(page.locator('#today')).toContainText('This is a sample, so nothing really goes out.')
  })

  test('the page makes no promise the business has not made', async ({ page }) => {
    await ready(page)
    const text = await page.locator('body').innerText()
    // A callback time, a call length and a week-by-week schedule were never promised by Omnia.
    expect(text).not.toMatch(/business day|\b\d+ minutes\b|\bWeek \d\b/i)
  })

  test('the list holds one item for each hire and the work already handled', async ({ page }) => {
    await ready(page)
    await expect(page.locator('#today [data-pick]')).toHaveCount(3)
    await expect(page.locator('#today [data-item] .tap__hire')).toHaveText(['Assistant', 'Chief of staff', 'Management team'])
    expect(await page.locator('#today [data-rows] li').count()).toBeGreaterThanOrEqual(9)
    await expect(page.locator('#today [data-need-count]')).toHaveText('3 need you')
  })

  test('an approval stamps the item and its row, and Undo takes it back', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await ready(page)
    await page.locator('#today').scrollIntoViewIfNeeded()
    const approve = card(page, 's1').locator('[data-approve]')
    await expect(card(page, 's1').locator('[data-flag]')).toHaveText('Needs your tap')
    await expect(row(page, 's1').locator('[data-st]')).toHaveText('Needs you')
    await approve.click()
    await expect(card(page, 's1').locator('[data-flag]')).toHaveText('Sent on your tap')
    await expect(card(page, 's1').locator('[data-stamp]')).toContainText('Sent 7:42 am, on your tap.')
    await expect(row(page, 's1').locator('[data-st]')).toHaveText('Sent')
    await expect(page.locator('#today [data-need-count]')).toHaveText('2 need you')
    await card(page, 's1').locator('[data-undo]').click()
    await expect(card(page, 's1').locator('[data-flag]')).toHaveText('Needs your tap')
    await expect(row(page, 's1').locator('[data-st]')).toHaveText('Needs you')
    await expect(page.locator('#today [data-need-count]')).toHaveText('3 need you')
  })

  test('a decline sends nothing and says so', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await ready(page)
    await pick(page, 's2')
    await expect(card(page, 's2')).toBeVisible()
    await expect(card(page, 's1')).toBeHidden()
    await card(page, 's2').locator('[data-decline]').click()
    await expect(card(page, 's2').locator('[data-flag]')).toHaveText('Declined')
    await expect(card(page, 's2').locator('[data-stamp]')).toContainText('Declined, nothing sent.')
    await expect(row(page, 's2').locator('[data-st]')).toHaveText('Declined')
  })

  test('three taps clear the list and no tap talks to a server', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await ready(page)
    const writes: string[] = []
    page.on('request', (request) => {
      if (request.method() !== 'GET') writes.push(`${request.method()} ${request.url()}`)
    })
    await card(page, 's1').locator('[data-approve]').click()
    await pick(page, 's2')
    await card(page, 's2').locator('[data-approve]').click()
    await pick(page, 's3')
    await expect(page.locator('#today [data-total]')).toHaveText('$1,925')
    await page.locator('#today [data-gap-input]').fill('45')
    await expect(page.locator('#today [data-total]')).toHaveText('$1,970')
    await card(page, 's3').locator('[data-approve]').click()
    await expect(page.locator('#today [data-need-count]')).toHaveText('Nothing needs you. The rest is handled.')
    expect(writes).toEqual([])
  })

  test('the business switch rewrites the list', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await ready(page)
    await expect(page.locator('#today [data-k="name"]')).toHaveText('Fig Street Café')
    const before = await card(page, 's1').locator('.tap__title').textContent()
    await card(page, 's1').locator('[data-approve]').click()
    await page.locator('input[name="biz"][value="dental"]').check()
    await expect(page.locator('#today [data-k="name"]')).toHaveText('Larkin Family Dental')
    await expect(card(page, 's1').locator('.tap__title')).not.toHaveText(before!)
    await expect(page.locator('#today [data-need-count]')).toHaveText('3 need you')
  })

  test('a sample message to a customer opens with "Hey" and the name', async ({ page }) => {
    await ready(page)
    for (const biz of ['cafe', 'dental', 'shop', 'plumbing']) {
      await page.locator(`input[name="biz"][value="${biz}"]`).check({ force: true })
      const drafts = await page.locator('#today .tap__draft').allTextContents()
      expect(drafts.length).toBe(2)
      for (const draft of drafts) expect(draft).toMatch(/^Hey [A-ZÀ-Ý][\p{L}.]+,/u)
    }
  })

  // ─── Pictures and diagrams ───────────────────────────────────────────
  test('a pointer that leaves a management card leaves its picture whole', async ({ page }) => {
    // The colour moment keeps each block of #team invisible until its line has passed. A card's loop
    // keeps its finished picture from the markup it met at boot and puts it back when the pointer leaves
    // the card. Rows the moment had hidden at boot came back hidden, and the picture stayed empty.
    await page.setViewportSize({ width: 1440, height: 900 })
    const shown = (id: string) =>
      page.evaluate((cardId) => {
        const panel = document.querySelector(`#${cardId} .panel`)!
        const out: string[] = []
        for (const el of panel.querySelectorAll<HTMLElement>('*')) {
          const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim())
          if (!own) continue
          let seen = 1
          for (let up: HTMLElement | null = el; up && up !== panel.parentElement; up = up.parentElement) {
            const style = getComputedStyle(up)
            seen *= style.visibility === 'hidden' || style.display === 'none' ? 0 : parseFloat(style.opacity)
          }
          if (seen >= 0.5) out.push(el.textContent!.trim())
        }
        return out.sort()
      }, id)
    for (const id of ['money', 'sales', 'customers', 'paperwork']) {
      const held = page.locator(`#${id} .ui.is-ui-held`)
      await page.evaluate((cardId) => {
        const top = document.querySelector(`#${cardId}`)!.getBoundingClientRect().top + scrollY
        scrollTo({ top: top - 120, behavior: 'instant' })
      }, id)
      await expect(held, `${id}: the picture rests`).toHaveCount(1, { timeout: 20_000 })
      await page.waitForTimeout(800)
      const before = await shown(id)
      expect(before.length, `${id}: the picture shows words at rest`).toBeGreaterThan(0)
      const box = (await page.locator(`#${id} h3`).boundingBox())!
      await page.mouse.move(box.x + 20, box.y + box.height / 2)
      await page.waitForTimeout(1500)
      await page.mouse.move(box.x + 20, 20)
      await expect(held, `${id}: the picture rests again`).toHaveCount(1, { timeout: 20_000 })
      await page.waitForTimeout(1200)
      expect(await shown(id), `${id}: every word shown before the hover is shown after it`).toEqual(expect.arrayContaining(before))
    }
  })

  test('the tools diagram draws the real tools around Jarvis', async ({ page }) => {
    await ready(page)
    const diagram = page.locator('#tools .dg')
    await diagram.scrollIntoViewIfNeeded()
    for (const label of ['Gmail', 'Google Calendar', 'QuickBooks', 'Stripe', 'Slack', 'Jarvis', 'Chief of staff']) {
      await expect(diagram).toContainText(label)
    }
    // The diagram draws each tool's own icon file inline. A file that did not load shows as a letter.
    for (const id of ['gmail', 'google-calendar', 'quickbooks', 'stripe', 'slack']) {
      await expect(diagram.locator(`.dg-ic[data-icon="${id}"] svg`).first()).toBeAttached()
    }
    await expect(diagram.locator('.dg-ic--missing')).toHaveCount(0)
  })

  test('the film plays only on a tap', async ({ page }) => {
    await ready(page)
    const film = page.locator('[data-film]')
    await film.scrollIntoViewIfNeeded()
    await expect(film.locator('video')).toHaveCount(0)
    await expect(film.locator('[data-play]')).toHaveAccessibleName('Play the 30-second introduction, with sound')
    await page.evaluate(() => { HTMLMediaElement.prototype.play = () => Promise.resolve() })
    await film.locator('[data-play]').click()
    await expect(film.locator('video')).toHaveAttribute('src', '/jarvis/visor/keeper-final-owner-approved-v2.mp4')
    await expect(film.locator('video')).toHaveJSProperty('controls', true)
    await expect(film.locator('[data-play]')).toHaveCount(0)
  })

  test('the two voices play one at a time, and a clip that fails says so', async ({ page }) => {
    await ready(page)
    const voices = page.locator('[data-voices]')
    await voices.scrollIntoViewIfNeeded()
    const ava = voices.locator('[data-voice="ava"]')
    const jarvis = voices.locator('[data-voice="jarvis"]')
    await expect(ava).toHaveAttribute('href', '/jarvis/assets/voice/ava-heart.mp3')
    await expect(jarvis).toHaveAttribute('href', '/jarvis/assets/voice/jarvis-liam.mp3')
    for (const href of ['/jarvis/assets/voice/ava-heart.mp3', '/jarvis/assets/voice/jarvis-liam.mp3']) {
      expect((await page.request.head(href)).status()).toBe(200)
    }
    await page.evaluate(() => { HTMLMediaElement.prototype.play = () => Promise.resolve() })
    await ava.click()
    await expect(ava).toHaveAttribute('aria-pressed', 'true')
    await jarvis.click()
    await expect(jarvis).toHaveAttribute('aria-pressed', 'true')
    await expect(ava).toHaveAttribute('aria-pressed', 'false')
    await jarvis.click()
    await expect(jarvis).toHaveAttribute('aria-pressed', 'false')
    await page.evaluate(() => { HTMLMediaElement.prototype.play = () => Promise.reject(new Error('no clip')) })
    await ava.click()
    await expect(voices.locator('[data-voice-status]')).toHaveText('That clip did not load. Try it again in a minute.')
    await expect(ava).toHaveAttribute('aria-pressed', 'false')
  })

  // ─── Call form ───────────────────────────────────────────────────────
  test('the call form keeps the /api/handoff contract', async ({ page }) => {
    const form = page.locator('form#handoff')
    await expect(form).toHaveAttribute('action', '/api/handoff')
    await expect(form).toHaveAttribute('method', 'post')
    // Wes, 10 Nov 2026: a name, an industry, an email and a cell. Nothing else shows.
    const shown = await form
      .locator('input, textarea, select')
      .evaluateAll((els) => els.filter((el) => (el as HTMLElement).offsetParent && (el as HTMLInputElement).name !== 'company').map((el) => (el as HTMLInputElement).name))
    expect(shown).toEqual(['fullName', 'industry', 'email', 'phoneNumber'])
    for (const name of ['interest', 'company']) await expect(form.locator(`[name="${name}"]`)).toHaveCount(1)
    await expect(form.locator('input[name="interest"]')).toHaveAttribute('type', 'hidden')
    await expect(form.locator('input[name="company"]')).toBeHidden()
    await expect(form.locator('[type="submit"]')).toHaveText('Request a call')
    await expect(form.locator('#sent')).toBeHidden()
    for (const id of ['f-name', 'f-industry', 'f-email', 'f-phone']) await expect(page.locator(`label[for="${id}"]`)).toBeVisible()
  })

  test('an empty form names what is missing and posts nothing', async ({ page }) => {
    let posts = 0
    await page.route('**/api/handoff', async (route) => {
      posts++
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' })
    })
    await page.goto('/?fresh=1#start')
    await ready(page)
    await page.locator('form#handoff [type="submit"]').click()
    for (const id of ['f-name', 'f-industry', 'f-email', 'f-phone']) {
      await expect(page.locator(`#${id}`)).toHaveAttribute('aria-invalid', 'true')
      await expect(page.locator(`#${id}-err`)).toBeVisible()
    }
    await expect(page.locator('form#handoff [data-form-status]')).toHaveText('4 fields to fix.')
    expect(await page.evaluate(() => (document.activeElement as HTMLInputElement | null)?.name)).toBe('fullName')
    expect(posts).toBe(0)
  })

  test('an email address without its @ is named and posts nothing', async ({ page }) => {
    let posts = 0
    await page.route('**/api/handoff', async (route) => {
      posts++
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' })
    })
    await page.goto('/?fresh=1#start')
    await ready(page)
    await page.fill('input[name="fullName"]', 'Test User')
    await page.fill('input[name="industry"]', 'Bakery')
    await page.fill('input[name="email"]', 'test.example.com')
    await page.fill('input[name="phoneNumber"]', '(512) 555-0100')
    await page.locator('form#handoff [type="submit"]').click()
    await expect(page.locator('#f-email-err')).toBeVisible()
    await expect(page.locator('#f-name-err')).toBeHidden()
    expect(posts).toBe(0)
  })

  test('a filled form posts its four answers once and asks for a JSON answer', async ({ page }) => {
    const posts: { accept: string; body: string }[] = []
    await page.route('**/api/handoff', async (route) => {
      posts.push({ accept: route.request().headers()['accept'] || '', body: route.request().postData() || '' })
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' })
    })
    await page.goto('/?hire=chief#start')
    await ready(page)
    await page.fill('input[name="fullName"]', 'Test User')
    await page.fill('input[name="industry"]', 'Bakery')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="phoneNumber"]', '(512) 555-0100')
    await page.locator('form#handoff [type="submit"]').click()
    await expect(page.locator('form#handoff [data-form-status]')).toHaveText('Your call request is in. Omnia will call you.')
    expect(posts.length).toBe(1)
    // the server answers a script with JSON only when the post asks for it (route.ts)
    expect(posts[0].accept).toContain('application/json')
    expect(posts[0].accept).not.toContain('text/html')
    for (const [name, value] of Object.entries({ fullName: 'Test User', industry: 'Bakery', email: 'test@example.com', phoneNumber: '(512) 555-0100', interest: 'Chief of staff', company: '' })) {
      expect(posts[0].body).toMatch(new RegExp(`name="${name}"\\r\\n\\r\\n${value.replace(/[()]/g, '\\$&')}\\r\\n`))
    }
    await expect(page.locator('input[name="fullName"]')).toHaveValue('')
  })

  test('a refused post says so, keeps what was typed and lets the visitor try again', async ({ page }) => {
    await page.route('**/api/handoff', (route) =>
      route.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"Failed to send notification"}' })
    )
    await page.goto('/?fresh=1#start')
    await ready(page)
    await page.fill('input[name="fullName"]', 'Test User')
    await page.fill('input[name="industry"]', 'Bakery')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="phoneNumber"]', '512 555 0100')
    await page.locator('form#handoff [type="submit"]').click()
    await expect(page.locator('form#handoff [data-form-status]')).toHaveText('Your request did not send. Try again in a minute, or email team@getoios.com.')
    await expect(page.locator('form#handoff [type="submit"]')).toBeEnabled()
    await expect(page.locator('input[name="fullName"]')).toHaveValue('Test User')
    await expect(page.locator('#sent')).toBeHidden()
  })

  test('an old ?pillar= link still sends its hire along unseen', async ({ page }) => {
    await page.goto('/?pillar=back-office#start')
    await ready(page)
    await expect(page.locator('form#handoff input[name="interest"]')).toHaveValue('Management team')
    await page.goto('/?pillar=everything#start')
    await ready(page)
    await expect(page.locator('form#handoff input[name="interest"]')).toHaveValue('')
  })

  test('/#sent, where the no-script post lands, shows the confirmation', async ({ page }) => {
    await page.goto('/?fresh=1#sent')
    await expect(page.locator('#sent')).toBeVisible()
    await expect(page.locator('#sent')).toHaveText('Your call request is in. Omnia will call you.')
  })

  // ─── Words ───────────────────────────────────────────────────────────
  // Wes: his name stays off the public pages. No em dash in copy a customer reads.
  test('the page holds no owner name and no em dash', async ({ page }) => {
    await ready(page)
    const html = await page.content()
    expect(html).not.toMatch(/Overstreet/i)
    expect(html).not.toMatch(/\bWes\b/)
    const text = await page.evaluate(() => document.body.innerText)
    expect(text).not.toContain('—')
  })

  // Wes, 2 Nov 2026: OIOS is for all small businesses, not just the trades.
  // The business switch offers one trade (the plumber) among four. The page as
  // it loads, and the other two businesses, must not read as trades-only.
  const TRADE_WORDS = /\b(truck|roof|crews?|price book|walkthrough|lumber|decks?|fence|hvac|contractors?)\b/i

  for (const biz of ['cafe', 'dental', 'shop']) {
    test(`the ${biz} list speaks to every small business, not just the trades`, async ({ page }) => {
      await ready(page)
      await page.locator(`input[name="biz"][value="${biz}"]`).check({ force: true })
      await page.waitForTimeout(200)
      const text = await page.evaluate(() => document.body.textContent || '')
      expect(text).not.toMatch(TRADE_WORDS)
      const alts = await page.locator('img[alt]').evaluateAll((els) => els.map((el) => el.getAttribute('alt') || ''))
      for (const alt of alts) expect(alt).not.toMatch(TRADE_WORDS)
    })
  }

  // ─── Footer ──────────────────────────────────────────────────────────
  test('the footer repeats the one action and links the legal pages', async ({ page }) => {
    const footer = page.locator('footer')
    await footer.scrollIntoViewIfNeeded()
    await expect(footer.locator('a.btn')).toHaveText('Request a call')
    for (const href of ['/privacy', '/terms', '/sms']) await expect(footer.locator(`a[href="${href}"]`)).toBeVisible()
    await expect(footer.locator('a[href="mailto:team@getoios.com"]')).toBeVisible()
    await expect(footer).toContainText('Product names and logos are trademarks of their owners.')
  })

  // ─── Phone ───────────────────────────────────────────────────────────
  for (const width of [390, 320]) {
    test(`fits a ${width} px phone with no sideways scroll, and the taps work there`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 })
      await page.goto('/')
      await ready(page)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1)
      await expect(page.locator('h1')).toBeVisible()
      await page.locator('#today').scrollIntoViewIfNeeded()
      await page.locator('#today [data-tab="s2"]').click()
      await expect(card(page, 's2')).toBeVisible()
      const approve = card(page, 's2').locator('[data-approve]')
      const box = await approve.boundingBox()
      expect(box!.height).toBeGreaterThanOrEqual(44)
      await approve.click()
      await expect(card(page, 's2').locator('[data-flag]')).toHaveText('Sent on your tap')
    })
  }

  // ─── Console errors ──────────────────────────────────────────────────
  test('no console errors on load or down the page', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (error) => errors.push(error.message))

    await page.goto('/')
    await ready(page)
    await page.waitForLoadState('networkidle')
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < height; y += 800) {
      await page.evaluate((top) => window.scrollTo(0, top), y)
      await page.waitForTimeout(120)
    }
    await page.waitForLoadState('networkidle')

    const realErrors = errors.filter(
      (e) => !e.includes('favicon') && !e.includes('ERR_BLOCKED_BY_CLIENT') && !e.includes('third-party')
    )
    expect(realErrors).toEqual([])
  })
})

// ─── Without script ────────────────────────────────────────────────────
test.describe('Homepage without script', () => {
  test.use({ javaScriptEnabled: false })

  test('the page still says what Jarvis is and shows the first item', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toHaveText('Jarvis is three hires in one')
    await expect(page.locator('#today [data-item="s1"] .tap__title')).toHaveText('Send this text to Sam Ortiz?')
    await expect(page.locator('[data-voices] [data-voice="ava"]')).toHaveAttribute('href', '/jarvis/assets/voice/ava-heart.mp3')
  })

  test('the form posts its four fields form-encoded to /api/handoff', async ({ page }) => {
    let contentType = ''
    let body = ''
    await page.route('**/api/handoff', async (route) => {
      contentType = route.request().headers()['content-type'] || ''
      body = route.request().postData() || ''
      await route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>answered</title>' })
    })
    await page.goto('/')
    await page.fill('input[name="fullName"]', 'Test User')
    await page.fill('input[name="industry"]', 'Bakery')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="phoneNumber"]', '512 555 0100')
    // Enter in a field submits through the button. A click waits on animation
    // frames, and a page without script gives Playwright none.
    await page.locator('input[name="phoneNumber"]').press('Enter')
    await expect(page).toHaveTitle('answered')
    expect(contentType).toContain('application/x-www-form-urlencoded')
    const sent = new URLSearchParams(body)
    expect(Object.fromEntries(sent)).toEqual({
      fullName: 'Test User',
      industry: 'Bakery',
      email: 'test@example.com',
      phoneNumber: '512 555 0100',
      interest: '',
      company: '',
    })
  })
})
