import { requireRequestCatch } from './require-request-catch.mjs';
import { requireSharedRequest } from './require-shared-request.mjs';


export default {
  meta: { name: 'project' },
  rules: {
    'require-shared-request': requireSharedRequest,
    'require-request-catch': requireRequestCatch,
  },
};
