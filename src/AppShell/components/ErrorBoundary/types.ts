import type { ReactNode } from 'react';
export interface ErrorBoundaryProps {
  children: (restored: boolean) => ReactNode;
}
export interface BoundaryState {
  failed: boolean;
  retrying: boolean;
  attempt: number;
}
