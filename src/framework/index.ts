export * from './routes';
export * from './config';
export * as events from './events';
export * from './types';

import Koa from 'koa';
import {
  v4 as uuidv4,
  v5 as uuidv5
} from 'uuid';
import { Workflow, locales } from '@axiosleo/cli-tool';
import * as operator from './app';
import { KoaContext, AppLifecycle } from './types';
import { config, paths } from './config';
import { resolveRouters } from './internal';
import { trigger, listen  } from './events';

export class HttpResponse extends Error {
  status: number
  data: Record<string, unknown> = {}
  headers: Record<string, string>
  format = 'json'
  constructor(httpStatus: number, data: Record<string, unknown>, headers: Record<string, string> = {}) {
    super();
    this.headers = headers;
    this.status = httpStatus;
    this.data = data;
  }
}

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
      method: ctx.req.method ? ctx.req.method : '',
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
