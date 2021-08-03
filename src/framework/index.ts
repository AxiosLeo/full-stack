export * from './routes';
export * from './config';
export * as events from './events';
export * from './types';

import Koa from 'koa';
import {
  v4 as uuidv4,
  v5 as uuidv5
} from 'uuid';
import { Workflow } from '@axiosleo/cli-tool';
import * as operator from './app';
import { KoaContext, AppLifecycle } from './types';
import { resolveRouters } from './internal';
import { listen } from './events';

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

export class Application {
  port: number;
  app_id: string;
  constructor(port: number, app_id?: string) {
    this.port = port;
    this.app_id = app_id ? app_id : '';
  }

  async start(): Promise<void> {
    resolveRouters();
    const koa = new Koa();
    await listen(AppLifecycle.START, this);
    koa.use(async (ctx: Koa.ParameterizedContext) => {
      const workflow = new Workflow<KoaContext>(operator);
      const context: KoaContext = {
        app: ctx,
        app_id: this.app_id,
        curr: {},
        step_data: {},
        method: ctx.req.method ? ctx.req.method : '',
        url: ctx.req.url ? ctx.req.url : '/',
        request_id: `${process.pid}-${uuidv5(uuidv4(), !this.app_id ? uuidv4() : this.app_id)}`
      };
      try {
        await workflow.start(context);
      } catch (exContext) {
        if (exContext.curr.error instanceof HttpResponse) {
          await listen(AppLifecycle.RESPONSE, context);
        } else {
          await listen(AppLifecycle.ERROR, context);
        }
      }
      await listen(AppLifecycle.DONE, context);
    });
    koa.listen(this.port);
  }
}
