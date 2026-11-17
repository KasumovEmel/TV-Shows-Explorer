import type { PageJump } from '../../types';


export interface PageNavProps {
  loading: boolean;
  pages: number;
  current: number;
  jump: (params: PageJump) => void;
}
