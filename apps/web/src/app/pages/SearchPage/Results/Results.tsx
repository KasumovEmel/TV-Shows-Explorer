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
    isGenreListPopulated,
    isGenreListLoading,
    isLoading,
    isLoadError,
    isEmpty,
    isGenreSectionVisible,
    genreLabel,
    emptyCopy,
    errorCopy,
    retry,
  } = usePresenter(props);

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
      {isGenreSectionVisible && (
        <div className={styles.genres} aria-hidden={!isGenreListPopulated}>
          {(isLoading || isGenreListPopulated) && (
            <>
              <span>{genreLabel}</span>
              <div
                className={styles.chips}
                inert={isGenreListLoading}
                aria-hidden={isGenreListLoading || undefined}
                role={isGenreListLoading ? undefined : 'group'}
                aria-label={isGenreListLoading ? undefined : genreLabel}
              >
                {isGenreListLoading ? (
                  <ChipSkeleton />
                ) : (
                  genreOptions.map((option) => <GenreChip key={option.value} {...option} />)
                )}
              </div>
            </>
          )}
        </div>
      )}
      {isLoadError && renderError(retry)}
      {isEmpty && (
        <div className={styles.notice} role="status">
          <h2>{emptyCopy.title}</h2>
          <p>{emptyCopy.hint}</p>
        </div>
      )}
      {!isLoadError && !isEmpty && (
        <ShowList
          key={props.revision}
          first={data}
          renderCard={props.renderCard}
          criteria={props.criteria}
          signal={props.search?.signal}
          isLoading={isLoading}
          renderPageError={renderError}
        />
      )}
    </section>
  );
}
