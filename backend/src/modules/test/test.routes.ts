import test from './test.controller';
import * as middlewares from '../../middleware';
import { Router, KoaContext } from '../../framework';
import { success, failed, StatusCode } from '../../response';

const testRouter: Router = new Router('/test');

testRouter.new('', {
  method: 'get',
  handlers: [test.index]
});

testRouter.new('/', {
  method: 'post',
  handlers: [async (context: KoaContext) => {
    success('hello world for post request');
  }]
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
  handlers: [test.sign],
  middlewares: [middlewares.checkSignature]
});

testRouter.new('/validate', {
  method: 'any',
  handlers: [test.validate]
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
