export * from './test';
export * from './response';

import { printer } from '@axiosleo/cli-tool';
import { config, events, KoaContext, HttpResponse } from '../framework';
import { error, failed, StatusCode } from './response';

events.register(events.AppLifecycle.START, async () => {
  printer.println().green('start on ')
    .println(`http://localhost:${config.port}`)
    .println();
  printer.yellow('app_id : ').print(config.app_id).println();
});

events.register(events.AppLifecycle.RECEIVE, async (context: KoaContext) => {
  if (config.debug) {
    printer.info('receive request : ' + context.request_id);
  }
});

events.register('response', async (context: KoaContext) => {
  const response = context.curr?.error as HttpResponse;
  context.app.type = response.format;
  response.data.request_id = context.request_id;
  context.app.body = JSON.stringify(response.data);
  context.app.response.status = response.status;
});

events.register('error', async (context: KoaContext): Promise<void> => {
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
