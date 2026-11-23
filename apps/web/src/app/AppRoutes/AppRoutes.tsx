import { FavoritesPage } from '../FavoritesPage';
import { SearchPage } from '../SearchPage';
import { usePresenter } from './usePresenter';
import type { AppRoutesProps } from './types';


export function AppRoutes({ isRestored }: AppRoutesProps) {
  const { isFavoritesPage } = usePresenter();

  return (
    <>
      <div hidden={isFavoritesPage}>
        <SearchPage isRestored={isRestored} />
      </div>
      {isFavoritesPage && <FavoritesPage />}
    </>
  );
}
