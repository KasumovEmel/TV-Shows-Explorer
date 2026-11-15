import { NotifyContext } from '../context';
import { Notification } from './components/Notification';
import { usePresenter } from './usePresenter';
import type { NotificationProviderProps } from './types';

import styles from './styles.module.css';


export function NotificationProvider(props: NotificationProviderProps) {
  const { alert, status, children, notify, dismiss } = usePresenter(props);

  return (
    <NotifyContext.Provider value={notify}>
      {children}
      <div className={styles.layer}>
        <div role="alert" aria-atomic="true">
          {alert && <Notification key={alert.id} {...alert} onDismiss={dismiss} />}
        </div>
        <div role="status" aria-atomic="true">
          {status && <Notification key={status.id} {...status} onDismiss={dismiss} />}
        </div>
      </div>
    </NotifyContext.Provider>
  );
}
