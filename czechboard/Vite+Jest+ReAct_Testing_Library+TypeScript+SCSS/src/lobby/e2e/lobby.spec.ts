import { test, expect } from '@playwright/test'

test.describe('Лобби: создание и подключение', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('показывает экран создания игры при загрузке', async ({ page }) => {
    await expect(page.getByTestId('lobby')).toBeVisible()
    await expect(page.getByTestId('create-room-btn')).toBeVisible()
    await expect(page.getByTestId('join-code-input')).toBeVisible()
    await expect(page.getByTestId('join-room-btn')).toBeVisible()
  })

  test('создание комнаты показывает код и экран ожидания', async ({ page }) => {
    await page.getByTestId('create-room-btn').click()

    await expect(page.getByTestId('waiting-screen')).toBeVisible()
    await expect(page.getByTestId('room-code')).toBeVisible()

    const code = await page.getByTestId('room-code').textContent()
    expect(code).toBeTruthy()
    expect(code!.length).toBeGreaterThanOrEqual(4)
  })

  test('создатель видит, что он играет за белых', async ({ page }) => {
    await page.getByTestId('create-room-btn').click()

    await expect(page.getByTestId('my-color')).toContainText('белых')
  })

  test('подключение по коду показывает экран connected и цвет', async ({ page }) => {
    await page.getByTestId('join-code-input').fill('ABC123')
    await page.getByTestId('join-room-btn').click()

    await expect(page.getByTestId('connected-screen')).toBeVisible()
    await expect(page.getByTestId('my-color')).toContainText('чёрных')
  })

  test('индикатор соперника меняется после подключения', async ({ page }) => {
    await page.getByTestId('join-code-input').fill('ABC123')
    await page.getByTestId('join-room-btn').click()

    await expect(page.getByTestId('opponent-status')).toContainText('подключён')
  })

  test('клик по подключению с пустым кодом ничего не ломает', async ({ page }) => {
    await page.getByTestId('join-room-btn').click()
    await expect(page.getByTestId('lobby')).toBeVisible()
    await expect(page.getByTestId('create-room-btn')).toBeVisible()
  })
})