import type { createApp } from '../src/app';


export interface FavoriteRequest {
  cookie?: string;
  path?: string;
  method?: string;
}

export interface ShowId {
  id: string;
}

export interface CatalogRequest {
  suffix: string;
  profile?: string;
}

export interface LoginRequest {
  app: ReturnType<typeof createApp>;
  email?: string;
}
