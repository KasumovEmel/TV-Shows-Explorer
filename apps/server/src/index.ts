import { serve } from '@hono/node-server';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

import { createApp } from './app';
import { ShowCatalog } from './catalog';
import { FavoritesStore } from './favorites';


const file = process.env.SQLITE_PATH ?? 'data/catalog.sqlite';
mkdirSync(dirname(file), { recursive: true });
const store = new FavoritesStore({ path: file });
const catalog = new ShowCatalog();
const app = createApp({ catalog, favorites: store, secure: process.env.NODE_ENV === 'production' });
const timer = setInterval(() => {
  catalog.prune();
  store.prune();
}, 60_000);
timer.unref();
const server = serve({
  fetch: app.fetch,
  hostname: '127.0.0.1',
  port: Number(process.env.PORT ?? 3001),
});

function close() {
  clearInterval(timer);
  server.close(() => store.close());
}

process.once('SIGTERM', close);
process.once('SIGINT', close);
