import type { IconName, IconProps } from './types';


const paths: Record<IconName, string> = {
  sun: 'M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M19 5l-1.5 1.5m-11 11L5 19',
  moon: 'M21 13a9 9 0 0 1-10-10 9 9 0 1 0 10 10Z',
  sunMoon:
    'M8 5.6a2.4 2.4 0 1 1-4.8 0 2.4 2.4 0 0 1 4.8 0ZM5.6 1v1m0 7.2v1M1 5.6h1m7.2 0h1M2.3 2.3l.7.7m5.2 5.2.7.7M8.9 2.3l-.7.7M3 8.2l-.7.7 ' +
    'M18 6 6 18 ' +
    'M23 18.8a4.6 4.6 0 0 1-4.5-4.5 4.5 4.5 0 1 0 4.5 4.5Z',
  restore: 'M4 10a8 8 0 1 1 0 6m0-13v7h7',
  close: 'M7 7l10 10M17 7 7 17',
  search: 'M16 16l5 5M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z',
  error: 'M8 2h8l6 6v8l-6 6H8l-6-6V8ZM12 7v6m0 4v.1',
  warning: 'M12 2 1.5 21h21ZM12 8v6m0 3v.2',
  success: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Zm-15 0 3.5 3.5 6.5-7',
  info: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM12 11v6m0-10v.15',
};

export function usePresenter({ name, size = 24 }: IconProps) {
  return { path: paths[name], size };
}
