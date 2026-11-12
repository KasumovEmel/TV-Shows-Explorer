import { defineConfig } from '@playwright/test';


export default defineConfig({
  testDir: './tests/browser',
  workers: 2,
  use: { baseURL: 'http://127.0.0.1:4817' },
  webServer: {
    command:
      'pnpm exec rsbuild build --config tests/rsbuild.config.ts && pnpm exec rsbuild preview --config tests/rsbuild.config.ts',
    url: 'http://127.0.0.1:4817',
    reuseExistingServer: false,
  },
});
