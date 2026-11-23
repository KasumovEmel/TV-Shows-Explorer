export type IconName =
  | 'more'
  | 'logout'
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
