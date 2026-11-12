import { Notification } from './components/Notification';
import { NotifyContext } from './context';
import { usePresenter } from './usePresenter';

import type { NotificationProviderProps } from './types';

import styles from './styles.module.css';


export function NotificationProvider({ children }: NotificationProviderProps) {
  const { active, notify, dismiss } = usePresenter();
  return (
    <NotifyContext.Provider value={notify}>
      {children}
      <div className={styles.layer}>
        <div role="alert" aria-atomic="true">
          {active?.kind === 'error' && (
            <Notification key={active.id} {...active} onDismiss={dismiss} />
          )}
        </div>
        <div role="status" aria-atomic="true">
          {active && active.kind !== 'error' && (
            <Notification key={active.id} {...active} onDismiss={dismiss} />
          )}
        </div>
      </div>
    </NotifyContext.Provider>
  );
}
