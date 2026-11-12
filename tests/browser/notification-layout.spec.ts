import { test, expect } from '@playwright/test';
import type { NotificationKind } from '@shared/components/NotificationProvider';
import palette from '../../docs/design/notification-tokens.json' with { type: 'json' };
import en from '../../src/Shared/i18n/locales/en.json' with { type: 'json' };
import ru from '../../src/Shared/i18n/locales/ru.json' with { type: 'json' };
import { notify } from './notify';

for (const [locale, strings] of Object.entries({ en, ru })) {
  for (const theme of ['light', 'dark'] as const) {
    for (const width of [320, 1440]) {
      test(`уведомления: ${locale}, ${theme}, ${width}px`, async ({ page }, info) => {
        await page.setViewportSize({ width, height: width === 320 ? 720 : 1000 });
        await page.emulateMedia({ colorScheme: theme });
        await page.addInitScript(
          (lang) => localStorage.setItem('tv-shows-explorer.language', lang),
          locale,
        );
        await page.goto('/fixture.html');
        const search = page.getByRole('searchbox');
        await search.focus();
        if (width === 320) {
          const session = await page.context().newCDPSession(page);
          await session.send('Emulation.setSafeAreaInsetsOverride', { insets: { top: 30 } });
        }
        for (const kind of Object.keys(palette.variant) as NotificationKind[]) {
          await notify(page, { kind });
          const note = page.locator(`[data-kind="${kind}"]`);
          const role = kind === 'error' ? 'alert' : 'status';
          await expect(page.getByRole(role).filter({ has: note })).toContainText(
            strings.notification[kind].message,
          );
          await expect(note.locator('strong')).toHaveText(strings.notification[kind].title);
          const { accent, surface, border } = palette.variant[kind][theme];
          const rgb = (hex: string) =>
            'rgb(' + [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(', ') + ')';
          await expect(note).toHaveCSS('background-color', rgb(surface));
          await expect(note).toHaveCSS('color', rgb(accent));
          await expect(note).toHaveCSS('border-top-color', rgb(border));
          const close = note.getByRole('button', { name: strings.notification.dismiss });
          const box = await note.boundingBox(),
            target = await close.boundingBox();
          if (!box || !target) throw new Error('Missing notification');
          expect(box.width).toBe(width === 320 ? 288 : 480);
          expect(box.x).toBe((width - box.width) / 2);
          expect(box.y).toBe(width === 320 ? 42 : 24);
          expect(target.width).toBeGreaterThanOrEqual(44);
          expect(target.height).toBeGreaterThanOrEqual(44);
          expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
          if (kind === 'warning')
            await page.screenshot({ path: info.outputPath('notification.png') });
          await close.click();
          await expect(note).toHaveCount(0);
        }
      });
    }
  }
}
