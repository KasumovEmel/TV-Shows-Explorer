import { deleteCookie } from 'hono/cookie';

import { sessionCookie } from '../session';
import type { LogoutContext } from '../../generated/routes.context';
import type { ServerEnv } from '../../types';


export function logout(c: LogoutContext<ServerEnv>) {
  c.var.favorites.logout(c.var.token);
  deleteCookie(c, sessionCookie, {
    path: '/',
    httpOnly: true,
    sameSite: 'Lax',
    secure: c.var.isCookieSecure,
  });

  return c.body(null, 204);
}
