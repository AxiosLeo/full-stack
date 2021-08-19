export * from './test';

import { testRouter } from './test';

import { Router, routers } from '../framework';

const testModuleRouter = new Router('/test', {
  routers: [testRouter]
});

routers.push(testModuleRouter);
