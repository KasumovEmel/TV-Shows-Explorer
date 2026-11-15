import type {
  AddFavoriteContext,
  HealthContext,
  ListFavoritesContext,
  RemoveFavoriteContext,
  SearchShowsContext,
} from './generated/routes.context';


type Env = { Variables: import('hono').ContextVariableMap };

export async function searchShows(c: SearchShowsContext<Env>) {
  return c.json(await c.var.catalog.search(c.req.valid('query')));
}

export function health(c: HealthContext<Env>) {
  try {
    c.var.store.ready();

    return c.json({ status: 'ok' });
  } catch (error) {
    console.error('Database readiness failed', error);

    return c.json({ code: 'storage_unavailable', message: 'Storage unavailable' }, 503);
  }
}

export function listFavorites(c: ListFavoritesContext<Env>) {
  return c.json({ items: c.var.store.list(c.var.sessionId) });
}

export async function addFavorite(c: AddFavoriteContext<Env>) {
  await c.var.store.add(c.var.sessionId, c.req.valid('param').showId, (id) =>
    c.var.catalog.byId(id),
  );

  return c.body(null, 204);
}

export function removeFavorite(c: RemoveFavoriteContext<Env>) {
  c.var.store.remove(c.var.sessionId, c.req.valid('param').showId);

  return c.body(null, 204);
}
