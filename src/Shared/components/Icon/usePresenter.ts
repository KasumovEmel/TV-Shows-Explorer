import type { IconName, IconProps } from './types';


const paths: Record<IconName, string> = {
  restore: 'M4 10a8 8 0 1 1 0 6m0-13v7h7',
  close: 'M7 7l10 10M17 7 7 17',
  search: 'M16 16l5 5M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z',
  error: 'M8 2h8l6 6v8l-6 6H8l-6-6V8ZM12 7v6m0 4v.1',
  warning: 'M12 2 1.5 21h21ZM12 8v6m0 3v.2',
  success: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Zm-15 0 3.5 3.5 6.5-7',
  info: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM12 11v6m0-10v.15',
  check: 'm5 12 4.5 4.5L19 7',
};
export function usePresenter({ name, size = 24 }: IconProps) {
  return { path: paths[name], size };
}
