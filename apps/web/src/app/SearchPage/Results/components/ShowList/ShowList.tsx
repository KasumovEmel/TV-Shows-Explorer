import { CardListSkeleton } from './components/CardListSkeleton';
import { CountSkeleton } from './components/CountSkeleton';
import { ListBoundary } from './components/ListBoundary';
import { PageNav } from './components/PageNav';
import { usePresenter } from './usePresenter';
import { ShowCard } from '@components/ShowCard';
import type { ShowListProps } from './types';

import styles from './styles.module.css';


export function ShowList(props: ShowListProps) {
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
            <CountSkeleton />
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
        <CardListSkeleton listClassName={styles.list} />
      ) : (
        <div ref={list}>
          {groups.map(({ page, cards, id, label }) => (
            <ul key={page} id={id} tabIndex={-1} aria-label={label} className={styles.list}>
              {cards.map((show) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </ul>
          ))}
        </div>
      )}
      {failed && props.renderPageError(retry)}
      <ListBoundary loading={loading} shown={shown} total={total} />
    </>
  );
}
