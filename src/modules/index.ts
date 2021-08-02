export * from './test';
export * from './response';
export * from './routes';

import { printer } from '@axiosleo/cli-tool';
import process from 'process';
import {
  config,
  events,
  AppLifecycle,
  KoaContext,
  HttpResponse
} from '../framework';
import { error, failed, StatusCode } from './response';

events.register(AppLifecycle.START, async (port: number, app_id: string) => {
  printer.input('-'.repeat(60));
  printer.yellow('app_id     : ').print(app_id).println();
  printer.yellow('process_id : ').print(`${process.pid}`).println();
});

events.register(AppLifecycle.RECEIVE, async (context: KoaContext) => {
  if (config.debug) {
    printer.info('receive request : ' + context.request_id);
  }
});

events.register(AppLifecycle.RESPONSE, async (context: KoaContext) => {
  const response = context.curr?.error as HttpResponse;
  context.app.type = response.format;
  response.data.request_id = context.request_id;
  context.app.body = JSON.stringify(response.data);
  context.app.response.status = response.status;
});

events.register(AppLifecycle.ERROR, async (context: KoaContext): Promise<void> => {
  try {
    if (!config.debug) {
      await error(500, context.curr.error ? context.curr.error : new Error('Internal Server Error'));
    } else {
      await failed(500, StatusCode.error);
    }
  } catch (err) {
    context.curr.error = err;
    await events.listen('response', context);
  }
});
