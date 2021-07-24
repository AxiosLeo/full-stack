import {
  index
} from './index.controller';

import { addRoute } from '@axiosleo/koan';

addRoute({
  path: '/***',
  method: 'any',
  handler: index
});
