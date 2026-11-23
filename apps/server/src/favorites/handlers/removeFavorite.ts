import type { RemoveFavoriteContext } from '../../generated/routes.context';
import type { ServerEnv } from '../../types';


export function removeFavorite(c: RemoveFavoriteContext<ServerEnv>) {
  const session = c.var.token;
  c.var.favorites.remove({ session, id: c.req.valid('param').showId });

  return c.json({ items: c.var.favorites.list(session) });
}
