import type { ContentfulStatusCode } from 'hono/utils/http-status';


export class ApiFailure extends Error {
  constructor(
    readonly status: ContentfulStatusCode,
    readonly code: string,
    message: string,
    readonly retryAfter?: string | null,
  ) {
    super(message);
  }
}
