import type { NotificationKind } from '@shared/types/notification';


export interface NotificationProps {
  kind: NotificationKind;
  id: number;
  messageKey?: string;
  onDismiss: (id: number) => void;
}
