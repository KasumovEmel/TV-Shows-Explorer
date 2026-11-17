import { ChipSkeleton } from './components/ChipSkeleton';
import { GenreChip } from './components/GenreChip';
import { ShowList } from './components/ShowList';
import { usePresenter } from './usePresenter';
import { Button } from '@components/Button';
import type { ResultsProps, RetrySearch } from './types';

import styles from './styles.module.css';


export function Results(props: ResultsProps) {
  const {
    data,
    genreOptions,
    hasGenres,
    selectedGenre,
    isLoading,
    loadError,
    isEmpty,
    showGenreSection,
    genreLabel,
    emptyCopy,
    errorCopy,
    retry,
  } = usePresenter(props);
  const loadingChips = isLoading && !hasGenres;

  function renderError(onRetry: RetrySearch) {
    return (
      <div className={styles.notice} role="alert">
        <h2>{errorCopy.title}</h2>
        <p>{errorCopy.hint}</p>
        <Button icon="restore" onClick={onRetry}>
          {errorCopy.retry}
        </Button>
      </div>
    );
  }

  return (
    <section className={styles.results}>
      {showGenreSection && (
        <div className={styles.genres} aria-hidden={!hasGenres}>
          {(isLoading || hasGenres) && (
            <>
              <span>{genreLabel}</span>
              <div
                className={styles.chips}
                inert={loadingChips}
                aria-hidden={loadingChips || undefined}
                role={loadingChips ? undefined : 'group'}
                aria-label={loadingChips ? undefined : genreLabel}
              >
                {loadingChips ? (
                  <ChipSkeleton />
                ) : (
                  genreOptions.map((genre) => (
                    <GenreChip
                      key={genre}
                      value={genre}
                      selected={genre === selectedGenre}
                      select={() => props.selectGenre(genre)}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}
      {loadError && renderError(retry)}
      {isEmpty && (
        <div className={styles.notice} role="status">
          <h2>{emptyCopy.title}</h2>
          <p>{emptyCopy.hint}</p>
        </div>
      )}
      {!loadError && !isEmpty && (
        <ShowList
          key={props.revision}
          first={data}
          criteria={props.criteria}
          signal={props.search?.signal}
          loading={isLoading}
          renderPageError={renderError}
        />
      )}
    </section>
  );
}
