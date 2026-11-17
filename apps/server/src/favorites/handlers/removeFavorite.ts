import type { RemoveFavoriteContext } from '../../generated/routes.context';
import type { ServerEnv } from '../../types';


export function removeFavorite(c: RemoveFavoriteContext<ServerEnv>) {
  c.var.favorites.remove({ session: c.var.ensureSession(), id: c.req.valid('param').showId });

  return c.body(null, 204);
}
