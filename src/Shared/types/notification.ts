export type NotificationKind = 'error' | 'warning' | 'success' | 'info';
export interface NotificationEvent {
  kind: NotificationKind;
  messageKey?: string;
}
