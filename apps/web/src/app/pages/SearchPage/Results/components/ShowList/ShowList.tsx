import { CardListSkeleton } from './components/CardListSkeleton';
import { CountSkeleton } from './components/CountSkeleton';
import { ListBoundary } from './components/ListBoundary';
import { PageNav } from './components/PageNav';
import { usePresenter } from './usePresenter';
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
    isLoading,
    isFailed,
    retry,
  } = usePresenter(props);

  return (
    <>
      <div className={styles.heading} ref={bar}>
        <div>
          <h2>{heading}</h2>
          {isLoading ? (
            <CountSkeleton />
          ) : (
            <span className={styles.count} role="status">
              {count}
            </span>
          )}
        </div>
        {(isLoading || pages > 1) && (
          <PageNav isLoading={isLoading} pages={pages} current={current} jump={jump} />
        )}
      </div>
      {isLoading ? (
        <CardListSkeleton listClassName={styles.list} />
      ) : (
        <div ref={list}>
          {groups.map(({ page, cards, id, label }) => (
            <ul key={page} id={id} tabIndex={-1} aria-label={label} className={styles.list}>
              {cards.map(props.renderCard)}
            </ul>
          ))}
        </div>
      )}
      {isFailed && props.renderPageError(retry)}
      <ListBoundary isLoading={isLoading} shown={shown} total={total} />
    </>
  );
}
