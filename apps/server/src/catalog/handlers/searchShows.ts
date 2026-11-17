import type { SearchShowsContext } from '../../generated/routes.context';
import type { ServerEnv } from '../../types';


export async function searchShows(c: SearchShowsContext<ServerEnv>) {
  return c.json(await c.var.catalog.search(c.req.valid('query')));
}
