import type { PropsWithChildren } from 'react';

import { SWRConfig } from 'swr';

import { usePresenter } from './usePresenter';


export function AppSWRConfig({ children }: PropsWithChildren) {
  const config = usePresenter();

  return <SWRConfig value={config}>{children}</SWRConfig>;
}
