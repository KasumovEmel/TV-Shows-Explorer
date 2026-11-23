import type { QueuedNotification } from '../../../../types';


export interface DismissTimerParams {
  isPaused: boolean;
  id: number;
  expire: (id: number) => void;
}

export interface NotificationLayerParams {
  item: QueuedNotification;
  depth: number | 'departing';
}
