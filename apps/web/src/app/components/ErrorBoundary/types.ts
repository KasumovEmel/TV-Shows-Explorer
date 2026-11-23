import type { ComponentType } from 'react';


export interface ScreenProps {
  isRestored: boolean;
}

export interface ErrorBoundaryProps {
  children: ComponentType<ScreenProps>;
}

export interface BoundaryState {
  isFailed: boolean;
  isRetrying: boolean;
  attempt: number;
}
