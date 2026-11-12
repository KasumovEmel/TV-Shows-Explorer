import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core';

import base from '../rsbuild.config';


export default defineConfig(
  mergeRsbuildConfig(base, {
    source: { entry: { index: './src/index.tsx', fixture: './tests/browser/fixture.tsx' } },
    output: { distPath: { root: '.rsbuild/browser-tests' } },
    server: {
      publicDir: [{ name: 'public' }, { name: 'tests/public' }],
      port: 4817,
      strictPort: true,
    },
  }),
);
