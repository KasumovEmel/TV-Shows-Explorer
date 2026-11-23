import { createFactory } from 'hono/factory';
import { logout } from '../../operations';
import type { LogoutContext } from '../routes.context';

const factory = createFactory();
export const logoutHandlers = factory.createHandlers(
  async (c: LogoutContext) => {
    return logout(c);
  },
);
