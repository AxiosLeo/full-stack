export * from './routes';
export * as events from './events';
export * from './types';
export * from './model';
export * from './controller';

import { v4 as uuidv4, v5 as uuidv5, validate } from 'uuid';
import Koa from 'koa';
import { Configuration } from '@axiosleo/cli-tool';
import { AppConfiguration, AppLifecycle, KoaContext } from './types';
import { listen } from '../framework/events';
import { resolveRouters, getRouteInfo } from './internal';
import { Workflow } from '@axiosleo/cli-tool';
import * as operator from './app';

export class HttpResponse extends Error {
  status: number;
  data: any = {};
  headers: Record<string, string>;
  format = 'json';
  constructor(httpStatus: number, data: any, headers: Record<string, string> = {}) {
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

export abstract class Application extends Configuration implements AppConfiguration {
  constructor(config: AppConfiguration) {
    super(config);
    this.app_id = config.app_id || '';
    if (!this.app_id) {
      this.app_id = uuidv4();
    }
    this.routes = resolveRouters(this.routers);
    this.workflow = new Workflow<KoaContext>(operator);
    listen(AppLifecycle.START, this);
  }

  abstract start(): Promise<void>;
}

const initContext = (app: Application, ctx: Koa.ParameterizedContext, app_id: string): KoaContext => {
  const context: KoaContext = {
    app,
    koa: ctx,
    app_id: app_id,
    curr: {},
    step_data: {},
    method: ctx.req.method ? ctx.req.method : '',
    url: ctx.req.url ? ctx.req.url : '/',
    request_id: `${uuidv5(uuidv4(), !validate(app_id) ? uuidv4() : app_id)}`
  };
  return context;
};

export const HttpRequestDispatcher = (app: Application, workflow: Workflow<KoaContext>, routes: any, app_id: string) => {
  return async (ctx: Koa.ParameterizedContext, next: any) => {
    const context = initContext(app, ctx, app_id);
    const router = getRouteInfo(routes, ctx.path, ctx.method);
    if (!router) {
      await listen(AppLifecycle.NOT_FOUND, context);
    }
    context.params = router?.params;
    context.body = ctx.request.body;
    context.query = ctx.request.query ? JSON.parse(JSON.stringify(ctx.request.query)) : {};
    context.headers = ctx.request.headers;
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
    await next();
  };
};
