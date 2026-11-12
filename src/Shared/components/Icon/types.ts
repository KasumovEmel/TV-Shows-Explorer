export type IconName =
  | 'restore'
  | 'close'
  | 'search'
  | 'error'
  | 'warning'
  | 'success'
  | 'info'
  | 'check';
export interface IconProps {
  name: IconName;
  size?: number;
}
