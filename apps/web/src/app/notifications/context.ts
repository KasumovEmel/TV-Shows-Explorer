import { createContext } from 'react';

import type { Notify } from './types';


export const NotifyContext = createContext<Notify | null>(null);
