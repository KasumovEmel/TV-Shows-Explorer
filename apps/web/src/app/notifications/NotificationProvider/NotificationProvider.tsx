import { NotifyContext } from '../context';
import { Notification } from './components/Notification';
import { usePresenter } from './usePresenter';
import type { NotificationProviderProps } from './types';

import styles from './styles.module.css';


export function NotificationProvider(props: NotificationProviderProps) {
  const { cards, departing, children, notify, dismiss, expire, finishExit } = usePresenter(props);

  return (
    <NotifyContext.Provider value={notify}>
      {children}
      <div className={styles.stack} aria-live="polite">
        {cards.length > 0 && (
          <Notification
            cards={cards}
            departing={departing}
            onDismiss={dismiss}
            onExpire={expire}
            onExitEnd={finishExit}
          />
        )}
      </div>
    </NotifyContext.Provider>
  );
}
