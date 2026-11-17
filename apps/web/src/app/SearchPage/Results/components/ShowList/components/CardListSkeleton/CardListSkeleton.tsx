import { usePresenter } from './usePresenter';
import { ShowCardLayout } from '@components/ShowCardLayout';
import type { CardListSkeletonProps } from './types';

import styles from './styles.module.css';


export function CardListSkeleton({ listClassName }: CardListSkeletonProps) {
  const { message, skeletonCount } = usePresenter();

  return (
    <div role="status">
      <span className={styles.srOnly}>{message}</span>
      <ul className={listClassName} aria-hidden="true">
        {Array.from({ length: skeletonCount }, (_, i) => (
          <ShowCardLayout
            key={i}
            poster={null}
            title={<span className={styles.title} />}
            year={<span className={styles.year} />}
            rating={
              <span className={styles.rating}>
                ★ <span />
              </span>
            }
            summary={
              <span className={styles.summary}>
                <span />
                <span />
              </span>
            }
            genres={<span className={styles.genres} />}
          />
        ))}
      </ul>
    </div>
  );
}
