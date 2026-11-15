import type { Show } from '../../../show';


export async function listFavorites(load: () => Promise<{ items: Show[] }>) {
  return (await load()).items;
}
