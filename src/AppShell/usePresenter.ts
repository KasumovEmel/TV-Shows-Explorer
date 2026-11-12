import { Catalog } from './components/Catalog';

import type { AppShellProps } from './types';


const catalogCache = { provider: () => new Map() };
export function usePresenter({ Screen = Catalog }: AppShellProps) {
  return { Screen, catalogCache };
}
