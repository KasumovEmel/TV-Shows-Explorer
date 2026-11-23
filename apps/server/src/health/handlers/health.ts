import type { HealthContext } from '../../generated/routes.context';
import type { ServerEnv } from '../../types';


export function health(c: HealthContext<ServerEnv>) {
  if (c.var.favorites.ready()) {
    return c.json({ status: 'ok' });
  }

  return c.json({ code: 'storage_unavailable', message: 'Storage unavailable' }, 503);
}
