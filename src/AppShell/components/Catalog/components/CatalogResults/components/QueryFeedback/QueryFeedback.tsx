import { usePresenter } from './usePresenter';
import { Button } from '@shared/components/Button';

import type { QueryFeedbackProps } from './types';

import styles from './styles.module.css';


export function QueryFeedback(props: QueryFeedbackProps) {
  const { failed, loading, role, title, detail, action, retry } = usePresenter(props);
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
        <div className={styles.skeletons} aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      )}
    </div>
  );
}
