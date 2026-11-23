import { StrictMode } from 'react';
import type { PropsWithChildren } from 'react';

import { AppRoutes } from './AppRoutes';
import { FavoritesProvider } from './favorites';
import { NotificationProvider } from './notifications';
import { ErrorBoundary } from '@components/ErrorBoundary';

import '@/styles/base.css';


export function App({ children }: PropsWithChildren) {
  return (
    <StrictMode>
      <NotificationProvider>
        <ErrorBoundary>
          {(isRestored) => (
            <FavoritesProvider>
              {children}
              <AppRoutes isRestored={isRestored} />
            </FavoritesProvider>
          )}
        </ErrorBoundary>
      </NotificationProvider>
    </StrictMode>
  );
}
