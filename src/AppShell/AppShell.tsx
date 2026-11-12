import { SWRConfig } from 'swr';

import { ErrorBoundary } from './components/ErrorBoundary';
import { usePresenter } from './usePresenter';
import { NotificationProvider } from '@shared/components/NotificationProvider';

import type { AppShellProps } from './types';


export function AppShell(props: AppShellProps) {
  const { Screen, catalogCache } = usePresenter(props);
  return (
    <NotificationProvider>
      <ErrorBoundary>
        {(restored) => (
          <SWRConfig value={catalogCache}>
            <Screen restored={restored} />
          </SWRConfig>
        )}
      </ErrorBoundary>
    </NotificationProvider>
  );
}
