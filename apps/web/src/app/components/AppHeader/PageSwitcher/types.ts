import type { MouseEventHandler } from 'react';


export type PageSwitcherProps = {
  favoritesPage: boolean;
  onClick: MouseEventHandler<HTMLAnchorElement>;
};
