import { test, expect, type Page } from '@playwright/test'

/**
 * The front door's layout rules (taste pass 1, 12 Nov 2026). The page keeps one
 * set of lines, one button look and one type scale. Each test measures the
 * rendered page, because a rule in day.css is not proof that a block sits on it.
 *
 * No test here posts the form.
 */
const ready = (page: Page) => expect(page.locator('html[data-ready]')).toHaveCount(1, { timeout: 15_000 })

async function open(page: Page, width: number, height: number) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width, height })
  await page.goto('/')
  await ready(page)
}

// The left and right content lines: where the first section heading starts and where the form ends.
const lines = (page: Page) =>
  page.evaluate(() => {
    const left = document.querySelector('#work-title')!.getBoundingClientRect().left
    const right = document.querySelector('#handoff')!.getBoundingClientRect().right
    return { left, right }
  })

test.describe('Front door layout', () => {
  for (const width of [1440, 2560]) {
    test(`the sticky bar sits on the page lines at ${width} px`, async ({ page }) => {
      await open(page, width, 900)
      await page.locator('#work').scrollIntoViewIfNeeded()
      await expect(page.locator('[data-tally]')).not.toHaveClass(/is-away/)
      const page_ = await lines(page)
      const bar = await page.evaluate(() => {
        const tally = document.querySelector('[data-tally]')!
        return {
          left: tally.querySelector('.tally__brand')!.getBoundingClientRect().left,
          right: tally.querySelector('a[href="#start"]')!.getBoundingClientRect().right,
        }
      })
      expect(Math.abs(bar.left - page_.left)).toBeLessThanOrEqual(1)
      expect(Math.abs(bar.right - page_.right)).toBeLessThanOrEqual(1)
    })
  }

  test('every split uses one second-column line and ends on the right line', async ({ page }) => {
    await open(page, 1440, 900)
    const page_ = await lines(page)
    const boxes = await page.evaluate(() => {
      const pick = (sel: string) => [...document.querySelectorAll(sel)].map((el) => {
        const r = el.getBoundingClientRect()
        return { sel, left: Math.round(r.left), right: Math.round(r.right), width: r.width }
      })
      return [
        ...pick('#day .stage .tapcard'), ...pick('#pm .tapcard'), ...pick('#night .tapcard'),
        ...pick('#rule .receipt'), ...pick('#work .pillar__pic'), ...pick('#behind .film'), ...pick('#handoff'),
      ]
    })
    expect(boxes).toHaveLength(9)
    for (const box of boxes) expect(box.width, box.sel).toBeGreaterThan(300)
    const lefts = boxes.map((b) => b.left)
    expect(Math.max(...lefts) - Math.min(...lefts), JSON.stringify(boxes)).toBeLessThanOrEqual(1)
    for (const box of boxes) expect(Math.abs(box.right - page_.right), box.sel).toBeLessThanOrEqual(1)
    // The split line is right of the text column, never the left line.
    expect(Math.min(...lefts)).toBeGreaterThan(page_.left + 300)
  })

  test('the receipt is straight and the text stands left of each picture', async ({ page }) => {
    await open(page, 1440, 900)
    expect(await page.locator('#rule .receipt').evaluate((el) => getComputedStyle(el).transform)).toBe('none')
    const order = await page.evaluate(() => {
      const x = (el: Element | null) => el!.getBoundingClientRect().left
      const pillars = [...document.querySelectorAll('#work .pillar')].map(
        (p) => x(p.querySelector('.pillar__body')) < x(p.querySelector('.pillar__pic')),
      )
      const behind = x(document.querySelector('#behind .behind__text')) < x(document.querySelector('#behind .film'))
      return [...pillars, behind]
    })
    expect(order).toEqual([true, true, true, true])
  })

  test('"Request a call" has one look, and each heading level has one size', async ({ page }) => {
    await open(page, 1440, 900)
    const looks = await page.evaluate(() => {
      const look = (el: Element) => {
        const s = getComputedStyle(el)
        return [s.backgroundColor, s.borderTopColor, s.borderTopWidth, s.boxShadow, s.minHeight].join(' | ')
      }
      return [look(document.querySelector('header.top a[href="#start"]')!), look(document.querySelector('[data-tally] a[href="#start"]')!)]
    })
    expect(looks[1]).toBe(looks[0])

    const sizes = await page.evaluate(() => {
      const seen = (tag: string) => [...new Set(
        [...document.querySelectorAll(tag)]
          .filter((el) => !el.classList.contains('vh') && (el as HTMLElement).offsetParent !== null)
          .map((el) => getComputedStyle(el).fontSize),
      )]
      return { h2: seen('h2'), h3: seen('h3') }
    })
    expect(sizes.h2, `h2 sizes ${sizes.h2}`).toHaveLength(1)
    expect(sizes.h3, `h3 sizes ${sizes.h3}`).toHaveLength(1)
    expect(parseFloat(sizes.h2[0])).toBeGreaterThan(parseFloat(sizes.h3[0]))
  })

  test('no caption stands on or under a picture, and no section has a lilac ground', async ({ page }) => {
    await open(page, 1440, 900)
    await expect(page.locator('#work figcaption')).toHaveCount(0)
    await expect(page.locator('#behind .film__note')).toHaveCount(0)
    await expect(page.locator('#behind [data-play]')).toContainText('with sound')
    const grounds = await page.evaluate(() => {
      const lilac = 'rgb(239, 232, 255)'
      const hits: string[] = []
      for (const section of document.querySelectorAll('main > section')) {
        if (getComputedStyle(section).backgroundColor === lilac) hits.push(`#${section.id}`)
        const before = getComputedStyle(section, '::before')
        if (before.content !== 'none' && before.backgroundColor === lilac) hits.push(`#${section.id}::before`)
      }
      return hits
    })
    expect(grounds).toEqual([])
  })

  test('the card shows a focus ring after a keyboard approval', async ({ page }) => {
    await open(page, 1440, 900)
    await page.locator('[data-scene="s1"] [data-approve]').focus()
    await page.keyboard.press('Enter')
    const done = page.locator('[data-scene="s1"] [data-done]')
    await expect(done).toBeFocused()
    const outline = await done.evaluate((el) => {
      const s = getComputedStyle(el)
      return { style: s.outlineStyle, width: parseFloat(s.outlineWidth) }
    })
    expect(outline.style).not.toBe('none')
    expect(outline.width).toBeGreaterThanOrEqual(2)
  })

  test('on a phone the bar docks to the bottom edge, full width', async ({ page }) => {
    await open(page, 390, 844)
    await page.locator('#work').scrollIntoViewIfNeeded()
    await expect(page.locator('[data-tally]')).not.toHaveClass(/is-away/)
    await page.waitForTimeout(100)
    const rect = await page.locator('[data-tally]').evaluate((el) => {
      const r = el.getBoundingClientRect()
      return { left: r.left, right: r.right, bottom: r.bottom }
    })
    expect(rect.left).toBe(0)
    expect(rect.right).toBe(390)
    expect(rect.bottom).toBe(844)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391)
  })

  test('the film poster loads as WebP and the film still starts', async ({ page }) => {
    await open(page, 390, 844)
    const poster = page.locator('#behind [data-film] img')
    await poster.scrollIntoViewIfNeeded()
    await expect.poll(() => poster.evaluate((el: HTMLImageElement) => el.currentSrc)).toMatch(/keeper-v2-poster-480\.webp$/)
    // Loaded, not only chosen. With a srcset the browser reports a density-corrected width, so the test asks for more than zero.
    await expect.poll(() => poster.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth)).toBeGreaterThan(0)
    await page.locator('#behind [data-play]').click()
    await expect(page.locator('#behind [data-film] > video')).toHaveCount(1)
    await expect(page.locator('#behind [data-film] picture')).toHaveCount(0)
  })

  test('no sample day uses a name from the stock list', async ({ page }) => {
    await open(page, 1440, 900)
    for (const biz of ['cafe', 'dental', 'shop', 'plumbing']) {
      await page.locator(`input[name="biz"][value="${biz}"]`).check({ force: true })
      await page.waitForTimeout(400)
      const text = await page.evaluate(() => document.body.innerText)
      expect(text, biz).not.toMatch(/\b(Dana|Okafor)\b/)
      // The day rendered: an empty page would pass the line above.
      expect(text.length, biz).toBeGreaterThan(2000)
      await expect(page.locator('[data-scene="s3"] .tapcard__title')).toContainText(/^Send this|^Approve|\?$/)
    }
  })
})
