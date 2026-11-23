import { createFactory } from 'hono/factory';
import { login } from '../../operations';
import type { LoginContext } from '../routes.context';
import { zValidator } from '../routes.validator';
import {
  LoginBody,
  LoginResponse
} from '../routes.zod';

const factory = createFactory();
export const loginHandlers = factory.createHandlers(
  zValidator('json', LoginBody),
  zValidator('response', LoginResponse),
  async (c: LoginContext) => {
    return login(c);
  },
);
