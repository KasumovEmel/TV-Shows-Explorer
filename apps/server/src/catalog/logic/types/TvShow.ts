import type { z } from 'zod';

import type { tvShow } from '../api/tvShow';


export type TvShow = z.infer<typeof tvShow>;
