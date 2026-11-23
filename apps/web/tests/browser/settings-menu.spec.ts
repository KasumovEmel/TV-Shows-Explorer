import { expect, test } from '@playwright/test';


for (const width of [320, 1280]) {
  test('меню шапки для гостя и пользователя, ширина ' + width, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.addInitScript(() => localStorage.setItem('tv-shows-explorer.language', 'ru'));
    await page.goto('/');
    const header = page.getByRole('banner');
    const menu = header.getByRole('button', { name: 'Ещё', exact: true });
    const panel = header.getByRole('group', { name: 'Ещё' });
    await expect(header.getByRole('link', { name: 'Войти' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Избранное' })).toHaveCount(0);
    await menu.press('Space');
    await expect(panel.getByRole('button')).toHaveCount(2);
    await expect(panel.getByText('Русский', { exact: true })).toBeVisible();
    await expect(panel.getByText('Системная', { exact: true })).toBeVisible();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await expect(menu).toBeFocused();
    await menu.click();
    await page.mouse.click(4, 4);
    await expect(panel).toBeHidden();

    const email =
      width === 320 ? 'long.email.for.a.small.screen@example.test' : 'reader@example.test';
    await page.request.post('/api/auth/login', { data: { email } });
    await page.reload();
    const address = header.getByText(email);
    const heart = header.getByRole('link', { name: 'Избранное (0)' });
    await expect(address).toBeVisible();
    await expect(heart).toBeVisible();
    await expect(header.getByRole('button', { name: 'Выйти' })).toHaveCount(0);
    await menu.click();
    await expect(panel.getByRole('button')).toHaveCount(3);
    await expect(panel.getByRole('button', { name: 'Выйти' })).toBeVisible();
    const bounds = await panel.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    const controls = await Promise.all(
      [address, heart, menu].map((control) => control.boundingBox()),
    );
    expect(controls[0]!.width).toBeGreaterThan(100);
    expect(controls[0]!.x + controls[0]!.width).toBeLessThanOrEqual(controls[1]!.x);
    expect(controls[1]!.x + controls[1]!.width).toBeLessThanOrEqual(controls[2]!.x);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    const start = width === 320 ? 0 : Math.floor(controls[0]!.x) - 24;
    await page.screenshot({
      path: test.info().outputPath('header.png'),
      clip: {
        x: start,
        y: 0,
        width: width - start,
        height: Math.ceil(bounds!.y + bounds!.height) + 20,
      },
    });
    await heart.click();
    await expect(page).toHaveURL(/\/favorites$/);
    await expect(heart).toHaveAttribute('aria-current', 'page');
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
  });
}

for (const colorScheme of ['light', 'dark'] as const) {
  test('подсветка и подсказки кнопок шапки, тема ' + colorScheme, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto('/');
    const themeName = 'System theme. Use dark theme';
    const theme = page.getByRole('button', { name: themeName });
    const language = page.getByRole('button', { name: 'Switch to Russian' });
    const more = page.getByRole('button', { name: 'More options' });
    const background = 'rgba(0, 0, 0, 0)';
    await expect(page.getByRole('banner').getByRole('link', { name: 'Sign in' })).toHaveCSS(
      'background-color',
      background,
    );
    await expect(language).toBeHidden();
    await more.press('Enter');
    await expect(language).toContainText('English');
    await expect(theme).toContainText('System');
    await expect(theme).toHaveAttribute('title', themeName);
    await expect(language).toHaveAttribute('title', 'Switch to Russian');
    await expect(theme).toHaveCSS('background-color', background);
    await expect(language).toHaveCSS('background-color', background);
    await theme.hover();
    await expect(theme).toHaveCSS('background-color', /[,/]\s*0\.\d+\)$/);
    const hovered = await theme.evaluate((el) => getComputedStyle(el).backgroundColor);
    await language.hover();
    await expect(language).toHaveCSS('background-color', hovered);
    await page.mouse.move(0, 0);
    await expect(language).toHaveCSS('background-color', background);
    await more.focus();
    await page.keyboard.press('Tab');
    await expect(language).toBeFocused();
    await expect(language).toHaveCSS('outline-style', 'solid');
    await language.press('Enter');
    await expect(page.getByRole('button', { name: 'Переключить на английский' })).toHaveAttribute(
      'title',
      'Переключить на английский',
    );
  });
}
