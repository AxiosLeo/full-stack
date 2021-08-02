import {
  index,
  route,
  internal,
  notFound,
} from './index.controller';

import { Router } from '../../framework';
import { failed, StatusCode } from '..';

export const testRouter: Router = new Router('');

testRouter.add(new Router('/', {
  method: 'any',
  handlers: [index]
}));

testRouter.add(new Router('/', {
  method: 'any',
  handlers: [index]
}));
testRouter.add(new Router('/***', {
  method: 'any',
  handlers: [notFound]
}));
testRouter.add(new Router('/route', {
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
testRouter.add(internalRoutes);
