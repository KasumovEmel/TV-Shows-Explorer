import type { FavoriteMutationParams } from '../types/FavoriteOperations';


export function removeFavorite({ id, request }: FavoriteMutationParams) {
  return request(id);
}
