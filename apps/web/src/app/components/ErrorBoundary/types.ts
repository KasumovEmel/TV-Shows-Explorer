import type { ReactNode } from 'react';


export interface ErrorBoundaryProps {
  children: (isRestored: boolean) => ReactNode;
}

export interface BoundaryState {
  isFailed: boolean;
  isRetrying: boolean;
  attempt: number;
}
