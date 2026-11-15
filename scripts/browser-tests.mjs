import { execFileSync } from 'node:child_process';


if (process.env.CI) {
  execFileSync(
    'pnpm',
    ['exec', 'playwright', 'install', '--with-deps', '--only-shell', 'chromium'],
    { stdio: 'inherit' },
  );
}
execFileSync('pnpm', ['exec', 'playwright', 'test'], {
  stdio: 'inherit',
  env: { ...process.env, TEST_WEB_BUILT: '1' },
});
