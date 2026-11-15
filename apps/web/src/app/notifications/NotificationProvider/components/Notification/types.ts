import type { QueuedNotification } from '../../types';


export interface NotificationProps {
  cards: QueuedNotification[];
  departing?: QueuedNotification;
  onDismiss: (id: number) => void;
  onExpire: (id: number) => void;
  onExitEnd: (id: number) => void;
}
