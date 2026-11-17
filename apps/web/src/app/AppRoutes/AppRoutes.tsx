import { FavoritesPage } from '../FavoritesPage';
import { SearchPage } from '../SearchPage';
import { usePresenter } from './usePresenter';
import type { AppRoutesProps } from './types';


export function AppRoutes({ restored }: AppRoutesProps) {
  const { favorites } = usePresenter();

  return (
    <>
      <div hidden={favorites}>
        <SearchPage restored={restored} />
      </div>
      {favorites && <FavoritesPage />}
    </>
  );
}
