import useSWR from 'swr';

import { countFavorites } from '@/api/generated/catalog';


export const favoritesCountKey = '/api/favorites/count';

export function useFavoritesCount() {
  const { data } = useSWR(favoritesCountKey, () => countFavorites());

  return data?.count;
}
