import test from './test.controller';

import { checkSignature } from '../../services/signature';
import { Router } from '../../framework';
import { failed, StatusCode } from '../..';

const testRouter: Router = new Router('');

testRouter.new('/', {
  method: 'any',
  handlers: [test.index]
});

testRouter.new('/', {
  method: 'any',
  handlers: [test.index]
});

testRouter.new('/***', {
  method: 'any',
  handlers: [test.notFound]
});

testRouter.new('/route', {
  method: 'any',
  handlers: [test.route]
});

testRouter.new('/sign', {
  method: 'any',
  handlers: [checkSignature, test.sign]
});

const internalRoutes = new Router('/internal', {
  method: 'any',
  handlers: [test.internal]
});

internalRoutes.new('/***', {
  method: 'any',
  handlers: [async () => {
    failed(400, StatusCode.unknown);
  }]
});

testRouter.add(internalRoutes);

export default testRouter;
