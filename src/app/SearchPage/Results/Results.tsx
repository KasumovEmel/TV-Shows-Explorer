import { GenreChip } from './components/GenreChip';
import { QueryFeedback } from './components/QueryFeedback';
import { PagedResults } from './PagedResults';
import { usePresenter } from './usePresenter';
import type { ResultsProps } from './types';

import styles from './styles.module.css';


const chipWidths = [54, 84, 118, 91, 70, 104, 78, 92];

export function Results(props: ResultsProps) {
  const { cards, chips, feedback, retry, genreLabel } = usePresenter(props);
  const loading = feedback === 'loading';

  return (
    <section className={styles.results}>
      {(loading || !feedback || (feedback !== 'error' && chips.length > 0)) && (
        <div className={styles.genres} aria-hidden={loading || !chips.length}>
          {(loading || !!chips.length) && (
            <>
              <span>{genreLabel}</span>
              <div
                className={styles.chips}
                inert={loading}
                aria-hidden={loading || undefined}
                role={loading ? undefined : 'group'}
                aria-label={loading ? undefined : genreLabel}
              >
                {loading
                  ? chipWidths.map((width) => (
                      <i key={width} className={styles.chipSkeleton} style={{ width }} />
                    ))
                  : chips.map((chip) => <GenreChip key={chip.value} {...chip} />)}
              </div>
            </>
          )}
        </div>
      )}
      {feedback && !loading ? (
        <QueryFeedback state={feedback} retry={retry} />
      ) : (
        <PagedResults key={props.revision} cards={cards} loading={loading} />
      )}
    </section>
  );
}
