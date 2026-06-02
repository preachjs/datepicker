import { test, expect } from '@playwright/test'

test.describe('basic', () => {
  test('should not change in readOnlyMode', async ({ page }) => {
    await page.goto('/')

    const content = page.locator('.selected-text')
    await expect(content).toHaveText('Selected: None')

    // Switch to read only mode
    await page.locator('[name=read-only]').click()

    // make a selection
    await page.locator('[data-row="1"][data-col="1"] > button').click()

    // Nothing should be selected
    await expect(content).toHaveText('Selected: None')
  })

  test('Switch between modes', async ({ page }) => {
    await page.goto('/')

    const content = page.locator('.selected-text')
    await expect(content).toHaveText('Selected: None')

    // Switch to range
    await page.locator('[name=mode][value=range]').click()
    await expect(content).toHaveText('Selected Range: None - None')

    // Switch to single
    await page.locator('[name=mode][value=single]').click()
    await expect(content).not.toHaveText('Selected Range: None - None')
    await expect(content).toHaveText('Selected: None')
  })

  test('Basic Keyboard movement', async ({ page }) => {
    await page.goto('/')
    await page.locator('[data-row="1"][data-col="1"] > button').click()

    // Down
    await page
      .locator('[data-row="1"][data-col="1"] > button')
      .press('ArrowDown')
    await expect(
      page.locator('[data-row="2"][data-col="1"] > button')
    ).toHaveCSS('background-color', /rgb\(0, 0, 0\)/)

    // Up
    await page.locator('[data-row="2"][data-col="1"] > button').press('ArrowUp')
    await expect(
      page.locator('[data-row="1"][data-col="1"] > button')
    ).toHaveCSS('background-color', /rgb\(0, 0, 0\)/)

    // Right
    await page
      .locator('[data-row="1"][data-col="1"] > button')
      .press('ArrowRight')
    await expect(
      page.locator('[data-row="1"][data-col="2"] > button')
    ).toHaveCSS('background-color', /rgb\(0, 0, 0\)/)

    // Left
    await page
      .locator('[data-row="1"][data-col="2"] > button')
      .press('ArrowLeft')
    await expect(
      page.locator('[data-row="1"][data-col="1"] > button')
    ).toHaveCSS('background-color', /rgb\(0, 0, 0\)/)
  })

  test('changes month and year from dropdowns', async ({ page }) => {
    await page.goto('/')

    // Months are 0-indexed: 10 => November
    await page.locator('.preachjs-calendar--header-month').selectOption('10')
    await page.locator('.preachjs-calendar--header-year').selectOption('2030')

    await expect(page.locator('.preachjs-calendar--grid')).toHaveAttribute(
      'aria-label',
      'Nov 2030'
    )
  })

  test('should disable dates before min', async ({ page }) => {
    await page.goto('/')

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    const formatDateInput = date => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    await page.locator('input[name="min"]').fill(formatDateInput(tomorrow))

    const todayISO = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).toISOString()
    await expect(page.locator(`[data-date="${todayISO}"]`)).toHaveClass(
      /preachjs-calendar--grid-cell-disabled/
    )
    await page
      .locator(`[data-date="${todayISO}"] > button`)
      .click({ force: true })

    await expect(page.locator('.selected-text')).toHaveText('Selected: None')
  })

  test('should disable dates after max', async ({ page }) => {
    await page.goto('/')

    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    const formatDateInput = date => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    await page.locator('input[name="max"]').fill(formatDateInput(yesterday))

    const todayISO = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).toISOString()
    await expect(page.locator(`[data-date="${todayISO}"]`)).toHaveClass(
      /preachjs-calendar--grid-cell-disabled/
    )
    await page
      .locator(`[data-date="${todayISO}"] > button`)
      .click({ force: true })

    await expect(page.locator('.selected-text')).toHaveText('Selected: None')
  })

  test('should allow selection within min and max', async ({ page }) => {
    await page.goto('/')

    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    const formatDateInput = date => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    await page.locator('input[name="min"]').fill(formatDateInput(yesterday))
    await page.locator('input[name="max"]').fill(formatDateInput(tomorrow))

    const todayISO = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).toISOString()
    await expect(page.locator(`[data-date="${todayISO}"]`)).not.toHaveClass(
      /preachjs-calendar--grid-cell-disabled/
    )
    await page.locator(`[data-date="${todayISO}"] > button`).click()

    await expect(page.locator('.selected-text')).not.toHaveText(
      'Selected: None'
    )
  })
})
