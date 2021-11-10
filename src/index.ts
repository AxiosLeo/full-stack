export * from './response';
export * from './modules';

import path from 'path';
import ini from 'ini';
import { printer, helper, debug } from '@axiosleo/cli-tool';
import { v4 as uuidv4 } from 'uuid';
import process from 'process';
import {
  events,
  routers,
  HttpError,
  KoaContext,
  Application,
  HttpResponse,
  AppLifecycle,
} from './framework';
import { error, failed, StatusCode } from './response';
import config from './config';
import { initialize } from './db';

events.register(AppLifecycle.START, async (app: Application) => {
  if (!app.app_id) {
    app.app_id = uuidv4();
  }
  printer.input('-'.repeat(60));
  printer.yellow('worker_id : ').print(`${process.pid}-${app.app_id}`).println();
});

events.register(AppLifecycle.RECEIVE, async (context: KoaContext) => {
  if (context.app.debug) {
    printer.input('receive request : ' + context.request_id);
  }
});

events.register(AppLifecycle.RESPONSE, async (context: KoaContext) => {
  const response = context.curr?.error as HttpResponse;
  context.koa.type = response.format;
  response.data.request_id = context.request_id;
  response.data.timestamp = (new Date()).getTime();
  context.koa.body = JSON.stringify(response.data);
  context.koa.response.status = response.status;
});

events.register(AppLifecycle.ERROR, async (context: KoaContext): Promise<void> => {
  try {
    const errorIns = context.curr.error;
    if (errorIns instanceof HttpError) {
      await error(errorIns.status, errorIns.message, errorIns.headers);
    } else if (errorIns instanceof HttpResponse) {
      await events.listen(AppLifecycle.RESPONSE, context);
    } else if (context.app.debug) {
      await error(500, context.curr.error ? context.curr.error.message : 'Internal Server Error');
    } else {
      await failed(500, StatusCode.error);
    }
  } catch (err: any) {
    context.curr.error = err;
    await events.listen(AppLifecycle.RESPONSE, context);
  }
});

events.register(AppLifecycle.NOT_FOUND, async (context: KoaContext): Promise<void> => {
  try {
    await failed(404, StatusCode.notFound);
  } catch (err: any) {
    context.curr.error = err;
    await events.listen(AppLifecycle.RESPONSE, context);
  }
});

events.register(AppLifecycle.DONE, async (context: KoaContext): Promise<void> => {
  if (context.app.debug && context.curr.error instanceof HttpResponse) {
    debug.dump(JSON.stringify(context.curr.error.data));
  }
});

export const start = async (port: number, appDebug = false): Promise<void> => {
  // prod | test | dev ....
  const env = process.env.NODE_ENV || 'local';
  const file = env !== 'local' ? `.env.${env}` : '.env';
  const filepath = path.join(__dirname, '../' + file);
  if (await helper.fs._exists(filepath)) {
    const obj = ini.decode(await helper.fs._read(filepath));
    config.assign(JSON.parse(JSON.stringify(obj)));
  }
  // initialize connectors
  const dbconfigs = config.get('db', {});
  try {
    initialize(dbconfigs);
    const app = new Application({
      debug: appDebug,
      port,
      app_id: '',
    });
    await app.start(routers, {
      static: {
        rootDir: path.join(__dirname, '../../views/dist'),
      }
    });
  } catch (err: any) {
    debug.dump(err);
  }
};
