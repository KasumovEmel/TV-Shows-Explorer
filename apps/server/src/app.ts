import { Hono } from 'hono';

import { ApiFailure } from './errors';
import { createFavoriteSessionMiddleware } from './favorites';
import routes from './generated/routes';
import type { AppOptions, ServerEnv } from './types';


export function createApp({ catalog, favorites, isCookieSecure = false }: AppOptions) {
  const app = new Hono<ServerEnv>();

  // oxlint-disable-next-line project/object-parameters -- Hono передаёт контекст и next отдельно.
  app.use('/api/*', async (c, next) => {
    if (process.env.RELEASE_SHA) {
      c.header('X-Release-Revision', process.env.RELEASE_SHA);
    }
    c.set('catalog', catalog);
    c.set('favorites', favorites);
    await next();
    if (c.res.status === 400) {
      c.res = c.json({ code: 'invalid_input', message: 'Invalid request parameters' }, 400);
    }
  });

  app.use('/api/favorites/*', createFavoriteSessionMiddleware(isCookieSecure));

  app.route('/', routes);
  app.notFound((c) => c.json({ code: 'not_found', message: 'Unknown API route' }, 404));
  // oxlint-disable-next-line project/object-parameters -- Hono передаёт ошибку и контекст отдельно.
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
