import type { FavoriteMutationParams } from '../types/FavoriteOperations';


export function addFavorite({ id, request }: FavoriteMutationParams) {
  return request(id);
}
