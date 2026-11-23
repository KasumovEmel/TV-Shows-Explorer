import type { CatalogStorage } from './catalog';
import type { FavoriteStorage, SessionStorage } from './favorites';


export const cache: CatalogStorage = {};
export const favorite: FavoriteStorage = {};

export const sessions: SessionStorage = {};
