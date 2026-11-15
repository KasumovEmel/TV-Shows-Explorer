import type { Show } from '../show';


export type NotificationKind = 'error' | 'warning' | 'success' | 'info';

export interface NotificationEvent {
  kind: NotificationKind;
  messageKey?: string;
  show?: Pick<Show, 'id' | 'originalTitle'>;
}
