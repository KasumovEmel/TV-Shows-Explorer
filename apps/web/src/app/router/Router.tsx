import { FavoritesPage } from '../pages/FavoritesPage';
import { SearchPage } from '../pages/SearchPage';
import { usePresenter } from './usePresenter';
import type { RouterProps } from './types';


export function Router({ children, isRestored }: RouterProps) {
  const { isFavoritesPage, favorites } = usePresenter();

  return (
    <>
      {children}
      <div hidden={isFavoritesPage}>
        <SearchPage isRestored={isRestored} favorites={favorites} />
      </div>
      {isFavoritesPage && <FavoritesPage favorites={favorites} />}
    </>
  );
}
