import { saveFavorite } from '../logic/tasks/saveFavorite';
import type { AddFavoriteContext } from '../../generated/routes.context';
import type { ServerEnv } from '../../types';


export async function addFavorite(c: AddFavoriteContext<ServerEnv>) {
  await saveFavorite({
    store: c.var.favorites,
    session: c.var.ensureSession(),
    id: c.req.valid('param').showId,
    loadShow: (id) => c.var.catalog.byId(id),
  });

  return c.body(null, 204);
}
