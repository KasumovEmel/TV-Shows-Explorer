import type { ReadFavorites } from '../types/FavoriteOperations';


export async function listFavorites(load: ReadFavorites) {
  return (await load()).items;
}
