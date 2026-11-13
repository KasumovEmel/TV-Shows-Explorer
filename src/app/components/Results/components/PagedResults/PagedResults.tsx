import { ListBoundary } from './components/ListBoundary';
import { LoadingCards } from './components/LoadingCards';
import { PageNav } from './components/PageNav';
import { ShowCard } from './components/ShowCard';
import { usePresenter } from './usePresenter';

import type { PagedResultsProps } from './types';

import styles from './styles.module.css';
import tiles from '@shared/styles/tiles.module.css';


export function PagedResults(props: PagedResultsProps) {
  const { heading, count, pages, current, groups, tail, jump, bar, list, shown, total, loading } =
    usePresenter(props);

  return (
    <>
      <div className={styles.heading} ref={bar}>
        <div>
          <h2>{heading}</h2>
          {loading ? (
            <span aria-hidden="true" className={styles.countSkeleton} />
          ) : (
            <span className={styles.count} role="status">
              {count}
            </span>
          )}
        </div>
        {(loading || pages > 1) && (
          <PageNav loading={loading} pages={pages} current={current} jump={jump} />
        )}
      </div>
      {loading ? (
        <LoadingCards />
      ) : (
        <div ref={list} className={styles.groups}>
          {groups.map(({ page, cards, id, label }) => (
            <ul key={page} id={id} tabIndex={-1} aria-label={label} className={tiles.grid}>
              {cards.map((show) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </ul>
          ))}
        </div>
      )}
      <ListBoundary loading={loading} shown={shown} total={total} />
      <div aria-hidden="true" ref={tail} />
    </>
  );
}
