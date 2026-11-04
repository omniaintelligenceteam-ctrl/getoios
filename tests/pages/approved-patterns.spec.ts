import { test, expect } from '@playwright/test'

test.use({
  baseURL: process.env.OIOS_TEST_URL || 'http://localhost:3000',
  launchOptions: process.env.PLAYWRIGHT_MCP_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_MCP_EXECUTABLE_PATH } : {},
})

// These checks catch broken disclosure, sample-step selection, and dialog lifecycle.
// Network isolation prevents booking embeds, media hosts, and live form/API writes.
test.beforeEach(async ({ page }) => {
  await page.route('**/*', async route => {
    const request = route.request()
    const url = new URL(request.url())
    if (url.hostname !== 'localhost' && url.hostname !== '127.0.0.1') return route.abort()
    if (request.method() !== 'GET') return route.abort()
    return route.continue()
  })
  await page.emulateMedia({ reducedMotion: 'reduce' })
})

test('categorized FAQ keeps scope and ownership answers reachable by keyboard', async ({ page }) => {
  await page.goto('/pricing')
  const faq = page.getByRole('region', { name: 'Questions before you start' })
  await expect(faq.getByRole('heading', { name: 'Scope & setup' })).toBeVisible()
  const question = faq.locator('summary').filter({ hasText: "Why don't you list prices publicly?" })
  await question.focus()
  await page.keyboard.press('Enter')
  await expect(faq.getByText(/We quote against what/)).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(faq.getByText(/We quote against what/)).not.toBeVisible()
  const ownership = faq.locator('summary').filter({ hasText: 'Is there a contract?' })
  await ownership.click()
  await expect(faq.getByText(/every tool, integration, and piece of data walks with you/)).toBeVisible()
})

test('workflow selection exposes the selected step and keeps approval visible', async ({ page }) => {
  await page.goto('/features')
  const workflow = page.getByRole('region', { name: 'One request, from draft to your decision' })
  const approve = workflow.getByRole('button', { name: /Your decision/ })
  await approve.click()
  await expect(approve).toHaveAttribute('aria-pressed', 'true')
  await expect(workflow.getByRole('region', { name: 'Selected workflow step' })).toContainText('Edit, approve, or leave it unsent')
  await expect(workflow.getByText('Nothing reaches a customer without your approval.')).toBeVisible()
})

test('sample recording dialog stays in viewport and restores keyboard focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/how-it-works')
  const trigger = page.getByRole('button', { name: 'Watch the sample workflow' })
  await trigger.focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog', { name: 'A sample Jarvis workflow' })
  await expect(dialog).toBeVisible()
  const video = dialog.locator('video')
  await expect(video).toHaveAttribute('controls', '')
  await expect(video).not.toHaveAttribute('autoplay', '')
  await expect(video.locator('track[kind="captions"]')).toHaveAttribute('src', '/jarvis/assets/proof/jarvis-workflow.vtt')
  const box = await dialog.boundingBox()
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.width).toBeLessThanOrEqual(390)
  expect(box!.height).toBeLessThanOrEqual(844)
  const close = dialog.getByRole('button', { name: 'Close sample video' })
  expect((await close.boundingBox())!.height).toBeGreaterThanOrEqual(44)
  await video.evaluate(async (el: HTMLVideoElement) => { await el.play() })
  await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.paused)).toBe(false)
  await close.focus()
  await page.keyboard.press('Tab')
  expect(await dialog.evaluate(el => el.contains(document.activeElement))).toBe(true)
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(trigger).toBeFocused()
  expect(await page.locator('dialog video').evaluate((el: HTMLVideoElement) => el.paused)).toBe(true)
  await trigger.click()
  await close.click()
  await expect(dialog).not.toBeVisible()
  await expect(trigger).toBeFocused()
})

test('explanatory sections fit narrow screens with readable ordered steps', async ({ page }) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 })
    for (const path of ['/how-it-works', '/features', '/pricing']) {
      await page.goto(path)
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1)
    }
  }
  await page.goto('/how-it-works')
  await expect(page.getByRole('list', { name: 'Installation milestones' }).getByRole('listitem')).toHaveCount(4)
  await expect(page.getByRole('region', { name: 'Connections to scope with you' })).toContainText('availability and access')
})

test('a missing recording leaves a readable transcript and a working close action', async ({ page }) => {
  await page.route('**/jarvis-workflow.mp4', route => route.fulfill({ status: 404, body: '' }))
  await page.goto('/how-it-works')
  await page.getByRole('button', { name: 'Watch the sample workflow' }).click()
  const dialog = page.getByRole('dialog', { name: 'A sample Jarvis workflow' })
  await dialog.locator('video').evaluate((el: HTMLVideoElement) => el.load())
  await expect(dialog.getByRole('status')).toContainText('The recording could not load')
  await dialog.locator('summary').click()
  await expect(dialog.getByText(/repair remains unpriced throughout/)).toBeVisible()
  await dialog.getByRole('button', { name: 'Close sample video' }).click()
  await expect(page.getByRole('button', { name: 'Watch the sample workflow' })).toBeFocused()
})
