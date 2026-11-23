import television from './television.svg';
import { usePresenter } from './usePresenter';
import { Brand } from '@components/Brand';
import { Button } from '@components/Button';
import type { RecoveryScreenProps } from './types';

import styles from './styles.module.css';


export function RecoveryScreen(props: RecoveryScreenProps) {
  const { heading, title, description, action, isRetrying, onRestore } = usePresenter(props);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Brand />
      </header>
      <div className={styles.layout}>
        <div className={styles.message}>
          <h1 ref={heading} tabIndex={-1}>
            {title}
          </h1>
          <p>{description}</p>
          <Button icon="restore" disabled={isRetrying} onClick={onRestore}>
            {action}
          </Button>
        </div>
        <img className={styles.art} src={television} width="520" height="400" alt="" />
      </div>
    </main>
  );
}
