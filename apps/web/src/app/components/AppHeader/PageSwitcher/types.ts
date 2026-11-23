import type { MouseEventHandler } from 'react';


export type PageSwitcherProps = {
  isFavoritesPage: boolean;
  count?: number;
  onClick: MouseEventHandler<HTMLAnchorElement>;
};
