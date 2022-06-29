import dotenv from 'dotenv';
import KoaBodyParser from 'koa-bodyparser';
import routers from './routes';
import Koa from 'koa';
import { register } from './framework/events';
import { printer, debug } from '@axiosleo/cli-tool';
import { v4 as uuidv4 } from 'uuid';
import process from 'process';
import {
  events,
  HttpError,
  KoaContext,
  Application,
  HttpResponse,
  AppLifecycle,
  HttpRequestDispatcher
} from './framework';
import { error, StatusCode } from './response';
import { mysql, mongo, redis } from './database';
dotenv.config();

const port = 8088;

register(AppLifecycle.START, async (app: Application) => {
  if (!app.app_id) {
    app.app_id = uuidv4();
  }
  printer.input('-'.repeat(60));
  // printer.yellow('worker_id : ').print(`${process.pid}-${app.app_id}`).println();
  printer.green('OpenAPI service start on ')
    .println(`http://localhost:${port}`).println();

  /**
   * initialize database
   */
  mysql.initialize();
  mongo.initialize();
  redis.initialize();
});

register(AppLifecycle.RECEIVE, async (context: KoaContext) => {
  if (context.app.debug) {
    printer.input('receive request : ' + context.request_id);
    if (context.koa.request.body) {
      debug.dump(context.koa.request.body);
    }
  }
});

register(AppLifecycle.RESPONSE, async (context: KoaContext) => {
  let response;
  if (context.curr?.error instanceof HttpResponse) {
    response = context.curr?.error as HttpResponse;
  } else {
    response = new HttpResponse(500, {});
  }
  context.koa.type = response.format;
  response.data.request_id = context.request_id;
  response.data.timestamp = (new Date()).getTime();
  context.koa.body = JSON.stringify(response.data);
  context.koa.response.status = response.status;
});

register(AppLifecycle.ERROR, async (context: KoaContext): Promise<void> => {
  try {
    const errorIns = context.curr.error;
    if (errorIns instanceof HttpError) {
      error(errorIns.status, errorIns.message, errorIns.headers);
    } else if (errorIns instanceof HttpResponse) {
      await events.listen(AppLifecycle.RESPONSE, context);
    } else if (context.app.debug) {
      debug.dump('error:', context.curr.error);
      error(500, context.curr.error ? context.curr.error.message : 'Internal Server Error');
    } else {
      error(500, StatusCode.error);
    }
  } catch (err: any) {
    context.curr.error = err;
    await events.listen(AppLifecycle.RESPONSE, context);
  }
});

register(AppLifecycle.NOT_FOUND, async (context: KoaContext): Promise<void> => {
  try {
    error(404, 'Not Found');
  } catch (err: any) {
    context.curr.error = err;
    await events.listen(AppLifecycle.RESPONSE, context);
  }
});

register(AppLifecycle.DONE, async (context: KoaContext): Promise<void> => {
  if (context.app.debug && context.curr.error instanceof HttpResponse) {
    debug.dump(JSON.stringify({
      path: context.koa.request.path,
      content: context.curr.error.data
    }));
  }
});

export class OpenAPIApplication extends Application {
  constructor() {
    const debug = process.env.DEPLOY_ENV !== 'production' ? true : false;
    super({
      port: port,
      debug,
      routers: [routers],
      app_id: debug ? '7dacefec-5482-4dea-8716-3a913041c789' : undefined
    });
  }
  async start(): Promise<void> {
    const koa = new Koa();
    koa.use(KoaBodyParser());
    koa.use(HttpRequestDispatcher(this, this.workflow, this.routes, this.app_id));

    // set process.env.LISTEN_HOST = '0.0.0.0' for public access
    koa.listen(this.port, process.env.LISTEN_HOST || 'localhost');
  }
}
