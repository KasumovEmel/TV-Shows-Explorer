import type { ReadFavorites } from '../../types';


export async function listFavorites(load: ReadFavorites) {
  return (await load()).items;
}
