import type { GetSessionContext } from '../../generated/routes.context';
import type { ServerEnv } from '../../types';


export function getSession(c: GetSessionContext<ServerEnv>) {
  return c.json({ email: c.var.favorites.email(c.var.token) });
}
