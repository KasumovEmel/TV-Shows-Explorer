import { defineConfig } from 'orval';


const input = {
  target: './packages/contracts/openapi.yaml',
  parserOptions: {
    externalRefs: {
      allow: [
        './paths/shows.yaml',
        './paths/favorite.yaml',
        './paths/favorites.yaml',
        './paths/health.yaml',
        './models.yaml',
        './errors.yaml',
        '../models.yaml',
        '../errors.yaml',
      ],
    },
  },
};
export default defineConfig({
  web: {
    input,
    output: {
      client: 'axios-functions',
      target: './apps/web/src/api/generated/catalog.ts',
      mode: 'split',
      override: { mutator: { path: './apps/web/src/app/utils/request.ts', name: 'request' } },
    },
  },
  server: {
    input,
    output: {
      client: 'hono',
      mode: 'split',
      target: './apps/server/src/generated/routes.ts',
      override: {
        hono: { handlers: './apps/server/src/generated/handlers' },
        zod: { coerce: { query: ['number'] } },
      },
    },
  },
});
