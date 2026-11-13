import { StrictMode } from 'react';
import type { PropsWithChildren } from 'react';

import { AppSWRConfig } from './components/AppSWRConfig';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NotificationProvider } from './notifications';
import { SearchPage } from './SearchPage';

import '@/styles/base.css';


export function App({ children }: PropsWithChildren) {
  return (
    <StrictMode>
      <NotificationProvider>
        <ErrorBoundary>
          {(restored) => (
            <AppSWRConfig>
              {children}
              <SearchPage restored={restored} />
            </AppSWRConfig>
          )}
        </ErrorBoundary>
      </NotificationProvider>
    </StrictMode>
  );
}
