import { test, expect, type Page } from '@playwright/test'

/**
 * The 3D opener above the Sample day: #core, the first section of the door.
 * Plan: ~/Plans/2026-11-02-getoios-3d-owner-jarvis-three-desks.md ("Done means").
 * Frozen check: written before the section existed, red on main, green once
 * public/jarvis/core3d.js lands. The engine publishes its state on #core:
 *   data-core-state   loading | rendered | static
 *   data-core-stop    1..5
 *   data-core-moving  true | false   (a camera move in flight)
 *   data-core-locked  true | false   (gestures drive the camera, not the page)
 *   data-core-models  how many of the five figures have loaded
 * and a small window.__core3d API: sample() (fraction of sampled canvas pixels
 * that differ from the #090909 background) and bytes() (model bytes fetched).
 *
 * Timing: the engine runs on wall-clock time, but a headless Chromium without a
 * GPU renders this room on SwiftShader at a frame every second or more, so the
 * waits below are generous and each block runs its tests one at a time.
 */
const MB = 1024 * 1024
const MOVE_MS = 2400
const NOISE = (m: string) => m.includes('favicon') || m.includes('ERR_BLOCKED_BY_CLIENT')

type Core3d = { sample(): Promise<number> | number; bytes(): number; goTo(n: number, instant?: boolean): Promise<void> | void }
declare global {
  interface Window { __core3d?: Core3d }
}

async function openDoor(page: Page) {
  const errors: string[] = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto('/')
  await expect(page.locator('html')).toHaveClass(/sc-ready/, { timeout: 15_000 })
  await page.mouse.move(Math.round(page.viewportSize()!.width / 2), Math.round(page.viewportSize()!.height / 2))
  return errors
}

const core = (page: Page) => page.locator('#core')

async function rendered(page: Page) {
  await expect(core(page)).toHaveCount(1, { timeout: 5000 })
  await expect(core(page)).toHaveAttribute('data-core-state', 'rendered', { timeout: 90_000 })
}

/** All five figures are in: gestures are judged on a room that is no longer loading. */
async function loaded(page: Page) {
  await rendered(page)
  await expect(core(page)).toHaveAttribute('data-core-models', '5', { timeout: 180_000 })
}

/** The camera has arrived at stop n and is holding there. */
async function settled(page: Page, n: number) {
  await expect(core(page)).toHaveAttribute('data-core-stop', String(n), { timeout: MOVE_MS + 12_000 })
  await expect(core(page)).toHaveAttribute('data-core-moving', 'false', { timeout: MOVE_MS + 12_000 })
}

/** #today fills the viewport: its top at (or just under) the top edge, its body well below the fold. */
async function todayInView(page: Page) {
  await expect
    .poll(async () => page.evaluate(() => {
      const r = document.getElementById('today')!.getBoundingClientRect()
      return r.top >= -2 && r.top <= 80 && r.bottom > innerHeight / 2
    }), { timeout: 20_000 })
    .toBe(true)
}

async function swipeUp(page: Page) {
  await page.evaluate(() => {
    const el = document.getElementById('core')!
    const mk = (type: string, y: number) => {
      const t = new Touch({ identifier: 1, target: el, clientX: 180, clientY: y, pageX: 180, pageY: y })
      return new TouchEvent(type, { touches: type === 'touchend' ? [] : [t], changedTouches: [t], bubbles: true, cancelable: true })
    }
    el.dispatchEvent(mk('touchstart', 600))
    el.dispatchEvent(mk('touchmove', 520))
    el.dispatchEvent(mk('touchmove', 440))
    el.dispatchEvent(mk('touchend', 400))
  })
}

test.describe('3D opener, desktop', () => {
  test.describe.configure({ mode: 'default' })
  test.use({ viewport: { width: 1440, height: 900 } })

  test('#core comes first, before #today, and holds the one h1', async ({ page }) => {
    await openDoor(page)
    await expect(page.locator('main > section').first()).toHaveAttribute('id', 'core')
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('#core h1')).toHaveCount(1)
    const coreBeforeToday = await page.evaluate(() => {
      const c = document.getElementById('core'), t = document.getElementById('today')
      return !!(c && t) && !!(c.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING)
    })
    expect(coreBeforeToday).toBe(true)
  })

  test('the canvas is not blank', async ({ page }) => {
    test.setTimeout(240_000)
    await openDoor(page)
    await rendered(page)
    const differ = await page.evaluate(() => window.__core3d!.sample())
    expect(differ).toBeGreaterThan(0.05)
  })

  test('ten wheel events in 200 ms move stop 1 to stop 2 only', async ({ page }) => {
    test.setTimeout(240_000)
    await openDoor(page)
    await loaded(page)
    await expect(core(page)).toHaveAttribute('data-core-stop', '1')
    // a trackpad flick: ten wheel ticks inside one page task. Timer-spaced ticks
    // would be stretched over seconds by a renderer that blocks the main thread.
    await page.evaluate(() => {
      for (let i = 0; i < 10; i++) window.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true }))
    })
    await settled(page, 2)
    await page.waitForTimeout(1500)
    await expect(core(page)).toHaveAttribute('data-core-stop', '2')
    await expect(core(page)).toHaveAttribute('data-core-locked', 'true')
  })

  test('up reverses one stop, ArrowDown advances one', async ({ page }) => {
    test.setTimeout(240_000)
    await openDoor(page)
    await loaded(page)
    await page.mouse.wheel(0, 120)
    await settled(page, 2)
    await page.waitForTimeout(400)
    await page.mouse.wheel(0, -120)
    await settled(page, 1)
    await page.waitForTimeout(400)
    await page.keyboard.press('ArrowDown')
    await settled(page, 2)
  })

  test('after stop 5 one gesture brings #today into view and releases the lock', async ({ page }) => {
    test.setTimeout(240_000)
    await openDoor(page)
    await loaded(page)
    await page.locator('.c3-dots button').nth(4).click()
    await settled(page, 5)
    await expect(page.locator('.c3-dots button').nth(4)).toHaveAttribute('aria-current', 'step')
    await page.waitForTimeout(400)
    await page.mouse.wheel(0, 120)
    await todayInView(page)
    await expect(core(page)).toHaveAttribute('data-core-locked', 'false')
  })

  test('"Skip to the sample day" works from stop 1', async ({ page }) => {
    test.setTimeout(240_000)
    await openDoor(page)
    await rendered(page)
    const skip = page.locator('#core a.c3-skip')
    await expect(skip).toHaveText(/Skip to the sample day/)
    await skip.click()
    await todayInView(page)
    await expect(core(page)).toHaveAttribute('data-core-locked', 'false')
  })

  test('reduced motion: no canvas, five lines as text, the wheel scrolls the page', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await openDoor(page)
    await expect(core(page)).toHaveAttribute('data-core-state', 'static')
    await expect(page.locator('#core canvas')).toHaveCount(0)
    await expect(page.locator('#core .c3-stop')).toHaveCount(5)
    for (let i = 0; i < 5; i++) await expect(page.locator('#core .c3-stop').nth(i)).toBeVisible()
    await page.mouse.wheel(0, 400)
    await expect.poll(() => page.evaluate(() => scrollY), { timeout: 5000 }).toBeGreaterThan(0)
  })

  test('zero console errors and model bytes under 6 MB', async ({ page }) => {
    test.setTimeout(240_000)
    const errors = await openDoor(page)
    await loaded(page)
    const bytes = await page.evaluate(() => window.__core3d!.bytes())
    expect(bytes).toBeGreaterThan(0)
    expect(bytes).toBeLessThanOrEqual(6 * MB)
    expect(errors.filter((m) => !NOISE(m))).toEqual([])
  })
})

test.describe('3D opener, phone', () => {
  test.describe.configure({ mode: 'default' })
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 })

  test('the canvas is not blank', async ({ page }) => {
    test.setTimeout(240_000)
    await openDoor(page)
    await rendered(page)
    const differ = await page.evaluate(() => window.__core3d!.sample())
    expect(differ).toBeGreaterThan(0.05)
  })

  test('a swipe advances one stop, then one more after stop 5 hands off to #today', async ({ page }) => {
    test.setTimeout(240_000)
    await openDoor(page)
    await loaded(page)
    await swipeUp(page)
    await settled(page, 2)
    await page.locator('.c3-dots button').nth(4).click()
    await settled(page, 5)
    await page.waitForTimeout(400)
    await swipeUp(page)
    await todayInView(page)
    await expect(core(page)).toHaveAttribute('data-core-locked', 'false')
  })

  test('zero console errors and model bytes under 4 MB', async ({ page }) => {
    test.setTimeout(240_000)
    const errors = await openDoor(page)
    await loaded(page)
    const bytes = await page.evaluate(() => window.__core3d!.bytes())
    expect(bytes).toBeGreaterThan(0)
    expect(bytes).toBeLessThanOrEqual(4 * MB)
    expect(errors.filter((m) => !NOISE(m))).toEqual([])
  })
})
