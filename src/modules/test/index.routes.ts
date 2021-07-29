import {
  index,
  route,
  notFound,
} from './index.controller';

import { routes } from '../../framework';

routes.addRoute({
  path: '/***',
  method: 'any',
  handler: notFound,
});

routes.addRoute({
  path: '/',
  method: 'any',
  handler: index
});

routes.addRoute({
  path: '/route',
  method: 'any',
  handler: route
});
