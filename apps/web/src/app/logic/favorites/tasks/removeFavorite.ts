import type { RemoveFavoriteParams } from '../types/FavoriteOperations';


export async function removeFavorite({ id, request }: RemoveFavoriteParams) {
  return (await request(id)).items;
}
