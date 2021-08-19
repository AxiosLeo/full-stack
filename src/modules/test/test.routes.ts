import {
  index,
  route,
  internal,
  notFound,
} from './test.controller';

import { Router } from '../../framework';
import { failed, StatusCode } from '../..';

const testRouter: Router = new Router('');

testRouter.new('/', {
  method: 'any',
  handlers: [index]
});

testRouter.new('/', {
  method: 'any',
  handlers: [index]
});

testRouter.new('/***', {
  method: 'any',
  handlers: [notFound]
});

testRouter.new('/route', {
  method: 'any',
  handlers: [route]
});

const internalRoutes = new Router('/internal', {
  method: 'any',
  handlers: [internal]
});

internalRoutes.new('/***', {
  method: 'any',
  handlers: [async () => {
    failed(400, StatusCode.unknown);
  }]
});

testRouter.add(internalRoutes);

export default testRouter;
