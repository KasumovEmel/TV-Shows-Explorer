import { setCookie } from 'hono/cookie';
import { z } from 'zod';

import { ApiFailure } from '../../errors';
import { sessionCookie, sessionLifetimeSeconds } from '../session';
import type { LoginContext } from '../../generated/routes.context';
import type { ServerEnv } from '../../types';


export function login(c: LoginContext<ServerEnv>) {
  const email = c.req.valid('json').email.trim().toLowerCase();
  if (!z.email().safeParse(email).success) {
    throw new ApiFailure({ status: 400, code: 'invalid_input', message: 'Invalid email' });
  }
  const token = c.var.favorites.login(email);
  c.var.favorites.logout(c.var.token);
  setCookie(c, sessionCookie, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'Lax',
    secure: c.var.isCookieSecure,
    maxAge: sessionLifetimeSeconds,
  });

  return c.json({ email });
}
