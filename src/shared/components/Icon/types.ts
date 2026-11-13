export type IconName =
  | 'restore'
  | 'close'
  | 'search'
  | 'error'
  | 'warning'
  | 'success'
  | 'info'
  | 'sun'
  | 'moon';
export interface IconProps {
  name: IconName;
  size?: number;
}
