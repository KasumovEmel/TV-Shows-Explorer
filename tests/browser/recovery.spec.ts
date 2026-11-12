import { test, expect } from '@playwright/test';

for (const width of [320, 390, 1440]) {
  test(`восстановление с клавиатуры при ширине ${width}`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: width === 1440 ? 1000 : 844 });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.addInitScript(() => {
      localStorage.setItem('tv-shows-explorer.language', 'ru');
      sessionStorage.setItem('fixture:fail', 'true');
    });
    await page.goto('/fixture.html');
    const heading = page.getByRole('heading', { name: 'Не удалось показать экран' });
    const restore = page.getByRole('button', { name: 'Восстановить' });
    await expect(heading).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(restore).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(heading).toBeFocused();
    await expect(restore).toBeEnabled();
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: info.outputPath('light.png') });
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(32, 29, 35)');
    await expect(heading).toBeFocused();
    await page.screenshot({ path: info.outputPath('dark.png') });
    const art = await page.locator('main img').boundingBox(),
      title = await heading.boundingBox();
    if (!art || !title) throw new Error('Missing recovery content');
    expect(width >= 768 ? art.x >= title.x + title.width : art.y + art.height <= title.y).toBe(
      true,
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await page.evaluate(() => sessionStorage.removeItem('fixture:fail'));
    await page.keyboard.press('Tab');
    await page.keyboard.press('Space');
    const input = page.getByRole('searchbox');
    await expect(input).toBeFocused();
    await expect(input).toHaveValue('');
    await expect(page.getByText('Поиск восстановлен.')).toBeVisible();
    await input.fill('Тьма');
    await expect(page.getByRole('heading', { name: 'Тьма' })).toBeVisible();
    await expect(input).toBeFocused();
    await page.getByRole('button', { name: 'Очистить поиск' }).click();
    await expect(input).toBeFocused();
    await expect(input).toHaveValue('');
  });
}
test('тема сохраняет ввод, жанр и фокус; язык переключается на месте', async ({ page }) => {
  await page.goto('/');
  const field = page.getByRole('searchbox');
  await field.fill('a');
  const chip = page.getByRole('button', { name: 'Drama', exact: true });
  await chip.click();
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(chip).toBeFocused();
  await expect(chip).toHaveAttribute('aria-pressed', 'true');
  await expect(field).toHaveValue('a');
  await page.getByRole('combobox').selectOption('ru');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(page.getByRole('heading', { name: 'Медведь' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('combobox')).toHaveValue('ru');
});
test('ошибка загрузки каталога остаётся в выдаче и допускает повтор', async ({ page }) => {
  await page.route('**/shows.json', (route) => route.fulfill({ status: 503, body: '' }));
  await page.goto('/');
  await expect(page.getByText('Couldn’t load the catalog.')).toBeVisible();
  await page.unroute('**/shows.json');
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('heading', { name: 'Dark' })).toBeVisible();
});
