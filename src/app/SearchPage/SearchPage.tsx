import { AppHeader } from './AppHeader';
import { Results } from './Results';
import { SearchIntro } from './SearchIntro';
import { usePresenter } from './usePresenter';
import type { SearchPageProps } from './types';

import styles from './styles.module.css';


export function SearchPage(props: SearchPageProps) {
  const { intro, results, resultsRef, term } = usePresenter(props);

  return (
    <>
      <div className={styles.masthead}>
        <AppHeader />
        <SearchIntro {...intro} />
      </div>
      <main ref={resultsRef}>{results && <Results key={term} {...results} />}</main>
    </>
  );
}
