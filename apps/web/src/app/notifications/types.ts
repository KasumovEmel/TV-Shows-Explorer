import type { Show } from '../show.types';


export type NotificationKind = 'error' | 'warning' | 'success' | 'info';

export interface NotificationEvent {
  kind: NotificationKind;
  messageKey?: string;
  show?: Pick<Show, 'id' | 'originalTitle'>;
}

export type Notify = (event: NotificationEvent) => void;
