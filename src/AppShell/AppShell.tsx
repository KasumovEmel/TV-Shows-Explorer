import { SWRConfig } from 'swr';
import { NotificationProvider } from '@shared/components/NotificationProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Catalog } from './components/Catalog';
import type { AppShellProps } from './types';
const catalogCache = { provider: () => new Map() };
export function AppShell({ Screen = Catalog }: AppShellProps) {
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
