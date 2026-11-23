import type { MouseEventHandler } from 'react';


export type PageSwitcherProps = {
  isFavoritesPage: boolean;
  onClick: MouseEventHandler<HTMLAnchorElement>;
};
