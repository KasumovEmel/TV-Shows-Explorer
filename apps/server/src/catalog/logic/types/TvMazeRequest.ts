import type { z } from 'zod';


export interface TvMazeClientOptions {
  transport?: typeof globalThis.fetch;
  timeout?: number;
}

export interface TvMazeRequest<T> {
  path: string;
  schema: z.ZodType<T>;
  isLookupById?: boolean;
}
