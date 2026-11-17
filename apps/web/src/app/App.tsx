import { StrictMode } from 'react';
import type { PropsWithChildren } from 'react';

import { AppRoutes } from './AppRoutes';
import { NotificationProvider } from './notifications';
import { AppSWRConfig } from '@components/AppSWRConfig';
import { ErrorBoundary } from '@components/ErrorBoundary';

import '@/styles/base.css';


export function App({ children }: PropsWithChildren) {
  return (
    <StrictMode>
      <NotificationProvider>
        <ErrorBoundary>
          {(restored) => (
            <AppSWRConfig>
              {children}
              <AppRoutes restored={restored} />
            </AppSWRConfig>
          )}
        </ErrorBoundary>
      </NotificationProvider>
    </StrictMode>
  );
}
