import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';


export default defineConfig({
  plugins: [pluginReact()],
  html: { template: './index.html' },
  output: { assetPrefix: 'auto' },
  // Start downloading the catalog alongside the entry without blocking the HTML loader.
  performance: { preload: { type: 'async-chunks', include: /\.(css|js)$/, exclude: /locale-ru/ } },
  server: { host: '127.0.0.1' },
});
