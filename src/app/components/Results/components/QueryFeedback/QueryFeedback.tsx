import { usePresenter } from './usePresenter';
import { Button } from '@shared/components/Button';

import type { QueryFeedbackProps } from './types';

import styles from './styles.module.css';
import tiles from '@shared/styles/tiles.module.css';


export function QueryFeedback(props: QueryFeedbackProps) {
  const { failed, loading, role, title, detail, action, retry, skeletonCount } =
    usePresenter(props);
  return (
    <div className={styles.feedback} role={role}>
      <h2>{title}</h2>
      {detail && <p>{detail}</p>}
      {failed && (
        <Button icon="restore" onClick={retry}>
          {action}
        </Button>
      )}
      {loading && (
        <div className={`${tiles.grid} ${styles.skeletons}`} aria-hidden="true">
          {Array.from({ length: skeletonCount }, (_, i) => (
            <div key={i} className={tiles.tile}>
              <div className={`${tiles.poster} ${styles.skeleton}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
