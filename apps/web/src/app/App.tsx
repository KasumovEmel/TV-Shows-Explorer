import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { NotificationProvider } from './notifications';
import { Router } from './router';
import { ErrorBoundary } from '@components/ErrorBoundary';
import type { AppParams } from './types/app.types';

import '@/styles/base.css';


export function App({ root, children }: AppParams) {
  createRoot(root).render(
    <StrictMode>
      <NotificationProvider>
        <ErrorBoundary>
          {({ isRestored }) => <Router isRestored={isRestored}>{children}</Router>}
        </ErrorBoundary>
      </NotificationProvider>
    </StrictMode>,
  );
}
