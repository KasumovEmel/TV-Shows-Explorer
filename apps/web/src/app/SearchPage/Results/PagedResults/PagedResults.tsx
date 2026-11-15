import { QueryFeedback } from '../components/QueryFeedback';
import { ListBoundary } from './components/ListBoundary';
import { LoadingCards } from './components/LoadingCards';
import { PageNav } from './components/PageNav';
import { usePresenter } from './usePresenter';
import { ShowCard } from '@/app/components/ShowCard';
import type { PagedResultsProps } from './types';

import styles from './styles.module.css';
import tiles from '@/app/components/ShowCardLayout/tiles.module.css';


export function PagedResults(props: PagedResultsProps) {
  const {
    heading,
    count,
    pages,
    current,
    groups,
    jump,
    bar,
    list,
    shown,
    total,
    loading,
    failed,
    retry,
  } = usePresenter(props);

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
        <div ref={list}>
          {groups.map(({ page, cards, id, label }) => (
            <ul key={page} id={id} tabIndex={-1} aria-label={label} className={tiles.list}>
              {cards.map((show) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </ul>
          ))}
        </div>
      )}
      {failed && <QueryFeedback state="error" retry={retry} />}
      <ListBoundary loading={loading} shown={shown} total={total} />
    </>
  );
}
