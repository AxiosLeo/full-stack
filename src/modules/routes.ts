import { Router } from '../framework';
import { testRouter } from './test/index.routes';

export const rootRouter: Router = new Router('');

rootRouter.add(testRouter);

const testModuleRouter = new Router('/test');
testModuleRouter.add(testRouter);
rootRouter.add(testModuleRouter);
