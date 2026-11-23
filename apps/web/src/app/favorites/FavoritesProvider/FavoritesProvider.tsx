import type { PropsWithChildren } from 'react';

import { FavoritesContext } from '../context';
import { usePresenter } from './usePresenter';


export function FavoritesProvider({ children }: PropsWithChildren) {
  const favorites = usePresenter();

  return <FavoritesContext value={favorites}>{children}</FavoritesContext>;
}
