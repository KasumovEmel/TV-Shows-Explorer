import { getCookie } from 'hono/cookie';

import { sessionCookie } from '../session';
import type { CountFavoritesContext } from '../../generated/routes.context';
import type { ServerEnv } from '../../types';


export function countFavorites(c: CountFavoritesContext<ServerEnv>) {
  return c.json({ count: c.var.favorites.count(getCookie(c, sessionCookie)) });
}
