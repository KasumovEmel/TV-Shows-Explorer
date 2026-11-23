import { FavoritesPage } from '../pages/FavoritesPage';
import { LoginPage } from '../pages/LoginPage';
import { SearchPage } from '../pages/SearchPage';
import { usePresenter } from './usePresenter';
import type { RouterProps } from './types';


export function Router({ children, isRestored }: RouterProps) {
  const { isSearchPage, isFavoritesPage, isLoginPage, favorites, account, login } = usePresenter();

  return (
    <>
      {children}
      <div hidden={!isSearchPage}>
        <SearchPage isRestored={isRestored} favorites={favorites} account={account} />
      </div>
      {isLoginPage && <LoginPage account={account} login={login} />}
      {isFavoritesPage && <FavoritesPage favorites={favorites} account={account} />}
    </>
  );
}
