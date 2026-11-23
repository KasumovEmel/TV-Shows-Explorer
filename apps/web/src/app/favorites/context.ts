import { createContext } from 'react';

import type { FavoritesState } from './types';


export const FavoritesContext = createContext<FavoritesState | null>(null);
