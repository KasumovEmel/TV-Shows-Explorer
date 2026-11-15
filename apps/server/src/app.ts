import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';

import { ApiFailure } from './errors';
import { lifetime, sessionCookie } from './favorites/store';
import routes from './generated/routes';
import type { Catalog } from './catalog/catalog';
import type { FavoritesStore } from './favorites/store';


declare module 'hono' {
  interface ContextVariableMap {
    catalog: Catalog;
    store: FavoritesStore;
    ensureSession: () => string;
  }
}

export function createApp(catalog: Catalog, store: FavoritesStore, secure = false) {
  const app = new Hono();

  app.use('/api/*', async (c, next) => {
    if (process.env.RELEASE_SHA) {
      c.header('X-Release-Revision', process.env.RELEASE_SHA);
    }
    c.set('catalog', catalog);
    c.set('store', store);
    await next();
    if (c.res.status === 400) {
      c.res = c.json({ code: 'invalid_input', message: 'Invalid request parameters' }, 400);
    }
  });

  app.use('/api/favorites/*', async (c, next) => {
    c.header('Cache-Control', 'private, no-store');
    c.set('ensureSession', () => {
      const { id, token } = store.session(getCookie(c, sessionCookie));
      if (token) {
        setCookie(c, sessionCookie, token, {
          path: '/',
          httpOnly: true,
          secure,
          sameSite: 'Lax',
          maxAge: lifetime,
        });
      }

      return id;
    });
    await next();
  });

  app.route('/', routes);
  app.notFound((c) => c.json({ code: 'not_found', message: 'Unknown API route' }, 404));
  app.onError((err, c) => {
    if (err instanceof ApiFailure) {
      if (err.retryAfter) {
        c.header('Retry-After', err.retryAfter);
      }

      return c.json({ code: err.code, message: err.message }, err.status);
    }
    console.error('API error', err);

    return c.json({ code: 'internal_error', message: 'Internal server error' }, 500);
  });

  return app;
}
