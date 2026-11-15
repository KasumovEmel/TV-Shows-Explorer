export type IconName =
  | 'heart'
  | 'restore'
  | 'close'
  | 'search'
  | 'error'
  | 'warning'
  | 'success'
  | 'info'
  | 'sun'
  | 'sunMoon'
  | 'moon';

export interface IconProps {
  name: IconName;
  size?: number;
}
