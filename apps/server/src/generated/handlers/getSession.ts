import { createFactory } from 'hono/factory';
import { getSession } from '../../operations';
import type { GetSessionContext } from '../routes.context';
import { zValidator } from '../routes.validator';
import { GetSessionResponse } from '../routes.zod';

const factory = createFactory();
export const getSessionHandlers = factory.createHandlers(
  zValidator('response', GetSessionResponse),
  async (c: GetSessionContext) => {
    return getSession(c);
  },
);
