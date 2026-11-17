import { getCookie, setCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';

import { sessionCookie, sessionLifetimeSeconds } from './session';
import type { ServerEnv } from '../types';


export function favoriteSession(secure: boolean) {
  // oxlint-disable-next-line project/object-parameters -- Hono передаёт контекст и next отдельно.
  return createMiddleware<ServerEnv>(async (c, next) => {
    c.header('Cache-Control', 'private, no-store');
    c.set('ensureSession', () => {
      const { id, token } = c.var.favorites.session(getCookie(c, sessionCookie));
      if (token) {
        setCookie(c, sessionCookie, token, {
          path: '/',
          httpOnly: true,
          secure,
          sameSite: 'Lax',
          maxAge: sessionLifetimeSeconds,
        });
      }

      return id;
    });
    await next();
  });
}
