export * from './routes';
export * as events from './events';
export * from './types';
export * from './model';

import Koa from 'koa';
import KoaBodyParser from 'koa-bodyparser';
import {
  v4 as uuidv4,
  v5 as uuidv5,
  validate,
} from 'uuid';
import { Workflow, Configuration } from '@axiosleo/cli-tool';
import * as operator from './app';
import { KoaContext, AppLifecycle, AppConfiguration } from './types';
import { resolveRouters, getRouteInfo } from './internal';
import { listen } from './events';
import { Router } from './routes';

export class HttpResponse extends Error {
  status: number;
  data: Record<string, unknown> = {};
  headers: Record<string, string>;
  format = 'json';
  constructor(httpStatus: number, data: Record<string, unknown>, headers: Record<string, string> = {}) {
    super();
    this.headers = headers;
    this.status = httpStatus;
    this.data = data;
  }
}

export class HttpError extends Error {
  status: number;
  message: string;
  headers: Record<string, string>;
  constructor(httpStatus: number, message: string, headers: Record<string, string> = {}) {
    super();
    this.status = httpStatus;
    this.message = message;
    this.headers = headers;
  }
}

export class Application extends Configuration {
  app_id: string;
  events: unknown[] = [];
  routes: Router[] = [];
  constructor(config: AppConfiguration) {
    super(config);
    this.app_id = config.app_id ? config.app_id : '';
    if (!this.app_id) {
      this.app_id = uuidv4();
    }
  }

  async start(routers?: Router[], options?: Record<string, any>): Promise<void> {
    const routes = resolveRouters(routers ? routers : []);
    const koa = new Koa(options);
    await listen(AppLifecycle.START, this);
    const workflow = new Workflow<KoaContext>(operator);
    koa.use(KoaBodyParser());
    koa.use(async (ctx: Koa.ParameterizedContext, next) => {
      const context: KoaContext = {
        app: this,
        koa: ctx,
        app_id: this.app_id,
        curr: {},
        step_data: {},
        method: ctx.req.method ? ctx.req.method : '',
        url: ctx.req.url ? ctx.req.url : '/',
        request_id: `${uuidv5(uuidv4(), !validate(this.app_id) ? uuidv4() : this.app_id)}`
      };
      const router: Router | null = await next();
      if (!router) {
        await listen(AppLifecycle.NOT_FOUND, context);
      }
      context.router = router;
      try {
        await workflow.start(context);
      } catch (exContext: any) {
        if (exContext.curr.error instanceof HttpResponse) {
          await listen(AppLifecycle.RESPONSE, context);
        } else {
          await listen(AppLifecycle.ERROR, context);
        }
      }
      await listen(AppLifecycle.DONE, context);
    });
    koa.use(async (ctx: Koa.ParameterizedContext) => {
      // find router
      const router = getRouteInfo(routes, ctx.path, ctx.method);
      if (router) {
        return router;
      }
      return null;
    });
    koa.listen(this.port);
  }
}
