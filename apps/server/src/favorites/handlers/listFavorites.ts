import type { ListFavoritesContext } from '../../generated/routes.context';
import type { ServerEnv } from '../../types';


export function listFavorites(c: ListFavoritesContext<ServerEnv>) {
  return c.json({ items: c.var.favorites.list(c.var.ensureSession()) });
}
