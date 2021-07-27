import {
  index,
  route,
  notFound,
} from './index.controller';

import { addRoute } from '../../framework';

addRoute({
  path: '/***',
  method: 'any',
  handler: notFound,
});

addRoute({
  path: '/',
  method: 'any',
  handler: index
});

addRoute({
  path: '/route',
  method: 'any',
  handler: route
});
