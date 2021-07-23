import {
  index
} from './index.controller';

import { addRoute } from '../../base';

addRoute({
  path: '/***',
  method: 'any',
  handler: index
});
