import type { QueuedNotification } from '../../types';


export interface NotificationProps extends QueuedNotification {
  onDismiss: (id: number) => void;
}
