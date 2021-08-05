import * as test from './test';

import { Router } from '../framework';

const testModuleRouter = new Router('/test', {
  routers: [test.testRouter]
});

const rootRouter: Router = new Router('', {
  routers: [test.testRouter, testModuleRouter]
});

export {
  rootRouter
};
