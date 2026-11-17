import type { z } from 'zod';

import type { tvShow } from './tvShow';


export type TvShow = z.infer<typeof tvShow>;
