import { usePresenter } from './usePresenter';
import { ShowCardLayout } from '@shared/components/ShowCardLayout';

import styles from './styles.module.css';
import tiles from '@shared/styles/tiles.module.css';


export function LoadingCards() {
  const { message, skeletonCount } = usePresenter();

  return (
    <div role="status">
      <span className={styles.srOnly}>{message}</span>
      <ul className={`${tiles.grid} ${styles.skeletons}`} aria-hidden="true">
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
                <span />
                <span />
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
