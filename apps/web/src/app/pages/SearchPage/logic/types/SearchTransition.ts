export interface SearchFilter {
  genre?: string;
  page: number;
  revision: number;
}

export interface SearchTransitionParams {
  isDocked: boolean;
  finishEntrance: () => void;
}

export type SearchPhase = 'idle' | 'entering' | 'docked';
