import { serve } from '@hono/node-server';

import { createApp } from './app';
import { ShowCatalog } from './catalog';
import { FavoritesStore } from './favorites';
import { cache, favorite } from './storage';


const store = new FavoritesStore({ storage: favorite });
const catalog = new ShowCatalog({ storage: cache });
const app = createApp({
  catalog,
  favorites: store,
  isCookieSecure: process.env.NODE_ENV === 'production',
});
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
  server.close();
}

process.once('SIGTERM', close);
process.once('SIGINT', close);
