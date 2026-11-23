import type { MouseEventHandler } from 'react';


export interface BrandProps {
  isCompactOnMobile?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}
