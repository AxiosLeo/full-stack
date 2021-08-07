export * from './response';
export * from './modules';

import { printer } from '@axiosleo/cli-tool';
import { v4 as uuidv4 } from 'uuid';
import process from 'process';
import {
  events,
  KoaContext,
  Application,
  HttpResponse,
  AppLifecycle,
} from './framework';
import { error, failed, StatusCode } from './response';

events.register(AppLifecycle.START, async (app: Application) => {
  if (!app.config.app_id) {
    app.config.app_id = uuidv4();
  }
  printer.input('-'.repeat(60));
  printer.yellow('worker_id : ').print(`${process.pid}-${app.config.app_id}`).println();
});

events.register(AppLifecycle.RECEIVE, async (context: KoaContext) => {
  if (context.app.config.debug) {
    printer.info('receive request : ' + context.request_id);
  }
});

events.register(AppLifecycle.RESPONSE, async (context: KoaContext) => {
  const response = context.curr?.error as HttpResponse;
  context.koa.type = response.format;
  response.data.request_id = context.request_id;
  context.koa.body = JSON.stringify(response.data);
  context.koa.response.status = response.status;
});

events.register(AppLifecycle.ERROR, async (context: KoaContext): Promise<void> => {
  try {
    if (context.app.config.debug) {
      await error(500, context.curr.error ? context.curr.error : new Error('Internal Server Error'));
    } else {
      await failed(500, StatusCode.error);
    }
  } catch (err) {
    context.curr.error = err;
    await events.listen(AppLifecycle.RESPONSE, context);
  }
});

events.register(AppLifecycle.NOT_FOUND, async (context: KoaContext): Promise<void> => {
  try {
    await failed(404, StatusCode.notFound);
  } catch (err) {
    context.curr.error = err;
    await events.listen(AppLifecycle.RESPONSE, context);
  }
});

// events.register(AppLifecycle.DONE, async (context: KoaContext): Promise<void> => {
// // printer.input(context.request_id);
// });
