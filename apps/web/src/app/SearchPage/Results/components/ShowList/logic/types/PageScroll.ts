import type { RefObject } from 'react';


export interface PageScrollParams {
  list: RefObject<HTMLDivElement | null>;
  jumpY: RefObject<number | null>;
  opened: number;
  pages: number;
  open: (page: number) => void;
}

export interface PageViewportParams {
  list: RefObject<HTMLDivElement | null>;
  bar: RefObject<HTMLDivElement | null>;
  opened: number;
  pages: number;
  select: (page: number) => void;
}
