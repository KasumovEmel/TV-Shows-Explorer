import { SWRConfig } from 'swr';

import { usePresenter } from './usePresenter';

import type { PropsWithChildren } from 'react';


export function AppSWRConfig({ children }: PropsWithChildren) {
  const config = usePresenter();

  return <SWRConfig value={config}>{children}</SWRConfig>;
}
