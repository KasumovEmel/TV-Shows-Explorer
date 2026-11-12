import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';


export default defineConfig({
  plugins: [pluginReact()],
  html: { template: './index.html' },
  output: { assetPrefix: 'auto' },
  server: { host: '127.0.0.1' },
});
