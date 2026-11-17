import type { ContentfulStatusCode } from 'hono/utils/http-status';

import type { ShowCatalog } from './catalog';
import type { FavoritesStore } from './favorites';


export interface ServerEnv {
  Variables: {
    catalog: ShowCatalog;
    favorites: FavoritesStore;
    ensureSession: () => string;
  };
}

export type Clock = () => number;

export interface AppOptions {
  catalog: ShowCatalog;
  favorites: FavoritesStore;
  secure?: boolean;
}

export interface ApiFailureOptions {
  status: ContentfulStatusCode;
  code: string;
  message: string;
  retryAfter?: string | null;
}
