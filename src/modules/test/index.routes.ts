import {
  index,
  route,
  internal,
  notFound,
} from './index.controller';

import { config, Router, HttpError, StatusCode } from '../../framework';

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
    throw new HttpError(StatusCode.unknown, 400);
  }]
}));
config.routes.push(internalRoutes);
