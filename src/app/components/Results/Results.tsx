import { GenreChip } from './components/GenreChip';
import { PagedResults } from './components/PagedResults';
import { QueryFeedback } from './components/QueryFeedback';
import { usePresenter } from './usePresenter';

import type { ResultsProps } from './types';

import styles from './styles.module.css';


export function Results(props: ResultsProps) {
  const { cards, revision, chips, feedback, retry, genreLabel } = usePresenter(props);
  return (
    <section className={styles.results}>
      {feedback ? (
        <QueryFeedback state={feedback} retry={retry} />
      ) : (
        <>
          {!!chips.length && (
            <div className={styles.genres} role="group" aria-label={genreLabel}>
              <span>{genreLabel}</span>
              {chips.map((chip) => (
                <GenreChip key={chip.value} {...chip} />
              ))}
            </div>
          )}
          <PagedResults key={revision} cards={cards} />
        </>
      )}
    </section>
  );
}
