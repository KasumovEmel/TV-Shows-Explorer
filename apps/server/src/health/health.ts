import type { HealthContext } from '../generated/routes.context';
import type { ServerEnv } from '../types';


export function health(c: HealthContext<ServerEnv>) {
  try {
    c.var.favorites.ready();

    return c.json({ status: 'ok' });
  } catch (error) {
    console.error('Database readiness failed', error);

    return c.json({ code: 'storage_unavailable', message: 'Storage unavailable' }, 503);
  }
}
