import path from 'path';
import Koa from 'koa';
import {
  v4 as uuidv4,
  v5 as uuidv5
} from 'uuid';
import {
  Workflow,
  helper,
  Context,
  printer
} from '@axiosleo/cli-tool';

import * as operator from './src/app';
import { config } from './src/config';

const { _write } = helper.fs;

export interface KoaContext extends Context {
  app: Koa.ParameterizedContext
}

async function end(context: KoaContext) {
  const is_debug = config.get('debug', false);
  if (is_debug) {
    const root_path = config.get('path.root', process.cwd());
    let cache_path = config.get('path.cache', 'runtime');
    cache_path = path.join(root_path, cache_path);
    await _write(
      path.join(
        __dirname,
        cache_path,
        `logs/${context.app_id}/${context.request_id}.json`
      ),
      JSON.stringify(context, null, 2)
    );
  }
}

export const start = (): void => {
  const koa = new Koa();
  const app_id = config.get('app_id', uuidv4());
  koa.use(async (ctx: Koa.ParameterizedContext) => {
    const workflow = new Workflow<KoaContext>(operator);
    const context = {
      app: ctx,
      curr: {},
      step_data: {},
      app_id,
      request_id: uuidv5(uuidv4(), app_id),
    };
    try {
      const res: KoaContext = await workflow.start(context);
      await end(res);
    } catch (e) {
      await end(e);
    }
  });
  const port = config.get('port', 3000);
  koa.listen(port);
  printer.println().green('start on ')
    .println(`http://localhost:${port}`)
    .println();
  printer.yellow('app_id    : ').print(app_id).println();
  printer.yellow('workflows : ').print(Object.keys(operator).join(' -> ') ).println().println();
};

start();
