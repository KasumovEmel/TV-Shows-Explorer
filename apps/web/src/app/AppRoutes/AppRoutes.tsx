import { FavoritesPage } from '../FavoritesPage';
import { SearchPage } from '../SearchPage';
import { usePresenter } from './usePresenter';


export function AppRoutes({ restored }: { restored: boolean }) {
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
