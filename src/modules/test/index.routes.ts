import {
  index
} from './index.controller';

import { addRoute } from '../../framework';

addRoute({
  path: '/***',
  method: 'any',
  handler: index
});

addRoute({
  path: '/',
  method: 'any',
  handler: index
});
