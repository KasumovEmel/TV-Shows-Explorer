import type { CountFavoritesContext } from '../../generated/routes.context';
import type { ServerEnv } from '../../types';


export function countFavorites(c: CountFavoritesContext<ServerEnv>) {
  return c.json({ count: c.var.favorites.count(c.var.token) });
}
