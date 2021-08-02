import {
  index,
  route,
  internal,
  notFound,
} from './index.controller';

import { config, Router } from '../../framework';
import { failed, StatusCode } from '..';

config.routes.push(new Router('/', {
  method: 'any',
  handlers: [index]
}));
config.routes.push(new Router('/***', {
  method: 'any',
  handlers: [notFound]
}));
config.routes.push(new Router('/route', {
  method: 'any',
  handlers: [route]
}));
const internalRoutes = new Router('/internal', {
  method: 'any',
  handlers: [internal]
});
internalRoutes.add(new Router('/***', {
  method: 'any',
  handlers: [async () => {
    failed(400, StatusCode.unknown);
  }]
}));
config.routes.push(internalRoutes);
