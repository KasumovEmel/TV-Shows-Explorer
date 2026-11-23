import type { LoginRequest } from './types';


export function requestLogin({ app, email }: LoginRequest) {
  return app.request('/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}
