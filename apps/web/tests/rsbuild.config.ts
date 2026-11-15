import { defineConfig, mergeRsbuildConfig } from '@rsbuild/core';

import base from '../rsbuild.config';


export default defineConfig(
  mergeRsbuildConfig(base, {
    source: { entry: { index: './src/index.tsx', fixture: './tests/browser/fixture.tsx' } },
    output: { manifest: { prefix: false }, distPath: { root: '.rsbuild/browser-tests' } },
    server: {
      proxy: { '/api/': 'http://127.0.0.1:4818' },
      publicDir: [{ name: 'public' }, { name: 'tests/public' }],
      port: 4817,
      strictPort: true,
    },
  }),
);
