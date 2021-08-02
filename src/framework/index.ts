export * from './routes';
export * from './config';
export * as events from './events';
export * from './response';
export * from './types';

import Koa from 'koa';
import {
  v4 as uuidv4,
  v5 as uuidv5
} from 'uuid';
import { Workflow, locales } from '@axiosleo/cli-tool';
import * as operator from './app';
import { KoaContext } from './types';
import { config, paths } from './config';
import { resolveMethod, HttpResponse } from './response';
import { resolveRouters } from './internal';
import { trigger, listen, AppLifecycle } from './events';


locales.init({
  dir: paths.locales,
  sets: ['en-US', 'zh-CN']
});

if (!config.app_id) {
  config.app_id = uuidv4();
}

export const start = async (): Promise<void> => {
  const koa = new Koa();
  resolveRouters();
  await trigger(AppLifecycle.START);
  koa.use(async (ctx: Koa.ParameterizedContext) => {
    const workflow = new Workflow<KoaContext>(operator);
    const context: KoaContext = {
      app: ctx,
      app_id: config.app_id,
      curr: {},
      step_data: {},
      method: resolveMethod(ctx.req.method),
      url: ctx.req.url ? ctx.req.url : '/',
      request_id: uuidv5(uuidv4(), config.app_id)
    };
    await listen(AppLifecycle.RECEIVE, context);
    try {
      await workflow.start(context);
    } catch (exContext) {
      if (exContext.curr.error instanceof HttpResponse) {
        await listen(AppLifecycle.RESPONSE, context);
      } else {
        await listen(AppLifecycle.ERROR, context);
      }
    }
  });
  koa.listen(config.port);
};
