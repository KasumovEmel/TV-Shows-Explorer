import type { ContentfulStatusCode } from 'hono/utils/http-status';

import type { ApiFailureOptions } from './types';


export class ApiFailure extends Error {
  readonly status: ContentfulStatusCode;
  readonly code: string;
  readonly retryAfter: string | null | undefined;

  constructor({ status, code, message, retryAfter }: ApiFailureOptions) {
    super(message);
    this.status = status;
    this.code = code;
    this.retryAfter = retryAfter;
  }
}
