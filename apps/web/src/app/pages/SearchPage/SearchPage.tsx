import { Results } from './Results';
import { SearchIntro } from './SearchIntro';
import { usePresenter } from './usePresenter';
import { AppHeader } from '@components/AppHeader';
import { ShowCard } from '@components/ShowCard';
import type { SearchPageProps } from './types';

import styles from './styles.module.css';


export function SearchPage(props: SearchPageProps) {
  const { intro, results, resultsRef, term, cardProps } = usePresenter(props);

  return (
    <>
      <div className={styles.masthead}>
        <AppHeader count={props.favorites.count} />
        <SearchIntro {...intro} />
      </div>
      <main ref={resultsRef}>
        {results && (
          <Results
            key={term}
            {...results}
            renderCard={(show) => <ShowCard key={show.id} {...cardProps(show)} />}
          />
        )}
      </main>
    </>
  );
}
