import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';

import { sessionCookie } from '../session';
import type { ServerEnv } from '../../types';


export function createFavoriteSessionMiddleware() {
  // oxlint-disable-next-line project/object-parameters -- Hono передаёт контекст и next отдельно.
  return createMiddleware<ServerEnv>(async (c, next) => {
    c.header('Cache-Control', 'private, no-store');
    const token = getCookie(c, sessionCookie) ?? '';
    c.set('token', token);
    if (c.req.path.startsWith('/api/favorites')) {
      c.var.favorites.requireEmail(token);
    }
    await next();
  });
}
