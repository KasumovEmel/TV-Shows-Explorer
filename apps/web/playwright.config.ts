import { defineConfig } from '@playwright/test';


export default defineConfig({
  testDir: './tests/browser',
  workers: 2,
  use: { baseURL: 'http://127.0.0.1:4817' },
  webServer: [
    {
      command: 'node --import tsx ../server/tests/browser-server.ts',
      url: 'http://127.0.0.1:4818/api/health',
    },
    {
      command:
        process.env.TEST_WEB_BUILT === '1'
          ? 'pnpm exec rsbuild preview --config tests/rsbuild.config.ts'
          : 'pnpm run build:tested && pnpm exec rsbuild preview --config tests/rsbuild.config.ts',
      url: 'http://127.0.0.1:4817',
      reuseExistingServer: false,
    },
  ],
});
