import type { FavoriteMutationParams } from '../../types';


export function removeFavorite({ id, request }: FavoriteMutationParams) {
  return request(id);
}
