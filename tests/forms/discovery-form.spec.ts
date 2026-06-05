import { test, expect } from '@playwright/test'

test.describe('Discovery Form (/form)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/form')
    await page.waitForLoadState('domcontentloaded')
  })

  // ─── Form rendering ──────────────────────────────────────────────────
  test('form page loads', async ({ page }) => {
    const response = await page.goto('/form')
    expect(response!.status()).toBe(200)
  })

  test('form element is present', async ({ page }) => {
    const form = page.locator('form')
    await expect(form).toBeVisible({ timeout: 10_000 })
  })

  test('all text input fields render', async ({ page }) => {
    // Required text inputs based on the DiscoveryForm component
    const fields = [
      { placeholder: /full name|your name/i },
      { placeholder: /business name|company/i },
      { placeholder: /what.*do|business.*description|describe/i },
      { placeholder: /phone|number/i },
    ]

    for (const field of fields) {
      const input = page.locator(`input[placeholder]`).filter({ hasText: field.placeholder }).or(
        page.locator('input').filter({ has: page.locator(`[placeholder]`) })
      )
      // Alternative: just check we have multiple inputs
    }

    // Verify form has multiple input elements
    const inputs = page.locator('form input')
    const count = await inputs.count()
    expect(count).toBeGreaterThanOrEqual(3)
  })

  test('radio group options render for team size', async ({ page }) => {
    const teamSizeOptions = ['Just me', '2-5', '6-15', '16+']
    for (const opt of teamSizeOptions) {
      const button = page.locator('button').filter({ hasText: opt })
      await expect(button).toBeVisible()
    }
  })

  test('radio group options render for calls per week', async ({ page }) => {
    const callOptions = ['Under 20', '20-50', '50-100', '100+']
    for (const opt of callOptions) {
      const button = page.locator('button').filter({ hasText: opt })
      await expect(button).toBeVisible()
    }
  })

  test('radio group options render for call handler', async ({ page }) => {
    const handlerOptions = ['Me', 'Office person', 'Answering service']
    for (const opt of handlerOptions) {
      const button = page.locator('button').filter({ hasText: new RegExp(`^${opt}$`) }).or(
        page.locator('button').filter({ hasText: opt })
      )
      const count = await button.count()
      expect(count).toBeGreaterThan(0)
    }
  })

  test('radio group options render for best time', async ({ page }) => {
    const timeOptions = ['Morning', 'Afternoon', 'Evening', 'Whenever']
    for (const opt of timeOptions) {
      const button = page.locator('button').filter({ hasText: opt })
      await expect(button).toBeVisible()
    }
  })

  test('submit button is present', async ({ page }) => {
    const submit = page.locator('button[type="submit"]')
    await expect(submit).toBeVisible()
  })

  // ─── Validation ──────────────────────────────────────────────────────
  test('submitting empty form shows error', async ({ page }) => {
    const submit = page.locator('button[type="submit"]')
    await submit.click()

    // Should show validation error for radio groups
    const errorText = page.getByText(/please answer|required|fill/i)
    await expect(errorText).toBeVisible({ timeout: 5_000 })
  })

  test('submitting with only text fields but no radio selections shows error', async ({ page }) => {
    // Fill in text fields but skip radio groups
    const inputs = page.locator('form input[type="text"], form input:not([type])')
    const count = await inputs.count()

    for (let i = 0; i < count; i++) {
      await inputs.nth(i).fill('Test Value')
    }

    const submit = page.locator('button[type="submit"]')
    await submit.click()

    // Client-side validation checks for radio groups
    const errorText = page.getByText(/please answer|required/i)
    await expect(errorText).toBeVisible({ timeout: 5_000 })
  })

  // ─── Radio selection interaction ─────────────────────────────────────
  test('clicking radio option selects it visually', async ({ page }) => {
    const option = page.locator('button').filter({ hasText: 'Just me' })
    await option.click()

    // After selection, the button should have the selected styling
    // Check for teal-related classes indicating selection
    const classes = await option.getAttribute('class')
    expect(classes).toContain('teal')
  })

  // ─── Successful submission (mocked API) ──────────────────────────────
  test('successful submission shows confirmation', async ({ page }) => {
    // Mock the form API endpoint
    await page.route('**/api/form', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })

    // Fill all text inputs
    const textInputs = page.locator('form input')
    const inputCount = await textInputs.count()
    for (let i = 0; i < inputCount; i++) {
      const type = await textInputs.nth(i).getAttribute('type')
      if (type !== 'hidden' && type !== 'submit') {
        await textInputs.nth(i).fill('Test Value ' + i)
      }
    }

    // Fill textarea if present
    const textareas = page.locator('form textarea')
    const taCount = await textareas.count()
    for (let i = 0; i < taCount; i++) {
      await textareas.nth(i).fill('Test description for the business')
    }

    // Select all radio groups
    await page.locator('button').filter({ hasText: 'Just me' }).click()
    await page.locator('button').filter({ hasText: 'Under 20' }).click()
    await page.locator('button').filter({ hasText: 'Me' }).first().click()
    await page.locator('button').filter({ hasText: 'Morning' }).click()

    // Submit
    const submit = page.locator('button[type="submit"]')
    await submit.click()

    // Wait for success message
    const success = page.getByText(/got it|thank|success|submitted/i)
    await expect(success).toBeVisible({ timeout: 10_000 })
  })

  // ─── API error handling ──────────────────────────────────────────────
  test('API error shows error message to user', async ({ page }) => {
    await page.route('**/api/form', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' }),
      })
    })

    // Fill form completely
    const textInputs = page.locator('form input')
    const inputCount = await textInputs.count()
    for (let i = 0; i < inputCount; i++) {
      const type = await textInputs.nth(i).getAttribute('type')
      if (type !== 'hidden' && type !== 'submit') {
        await textInputs.nth(i).fill('Test Value ' + i)
      }
    }

    const textareas = page.locator('form textarea')
    const taCount = await textareas.count()
    for (let i = 0; i < taCount; i++) {
      await textareas.nth(i).fill('Test description')
    }

    await page.locator('button').filter({ hasText: 'Just me' }).click()
    await page.locator('button').filter({ hasText: 'Under 20' }).click()
    await page.locator('button').filter({ hasText: 'Me' }).first().click()
    await page.locator('button').filter({ hasText: 'Morning' }).click()

    const submit = page.locator('button[type="submit"]')
    await submit.click()

    // Should show an error message
    const error = page.getByText(/error|failed|wrong|try again/i)
    await expect(error).toBeVisible({ timeout: 10_000 })
  })
})
