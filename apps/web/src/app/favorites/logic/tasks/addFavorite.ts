import type { FavoriteMutationParams } from '../../types';


export function addFavorite({ id, request }: FavoriteMutationParams) {
  return request(id);
}
