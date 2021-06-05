import path from 'path';
import Koa from 'koa';
import {
  v4 as uuidv4,
  v5 as uuidv5
} from 'uuid';
import {
  Workflow,
  Configuration,
  helper,
  Context
} from '@axiosleo/cli-tool';
import * as operator from './src/app';

const { _write } = helper.fs;

export interface KoaContext extends Context, Koa.ParameterizedContext {
}

export const config = new Configuration({
  debug: false,
  port: 3000,
  app_id: null,
  path: {
    root: process.cwd(),
    cache: 'runtime',
    config: 'config'
  }
});

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
  koa.use(async (ctx: KoaContext) => {
    const workflow = new Workflow<KoaContext>(operator);
    console.log(`app_id : ${app_id}`);
    Object.assign(ctx, {
      workflows: Object.keys(operator),
      step_data: {},
      app_id,
      request_id: uuidv5(uuidv4(), app_id),
    });
    console.log(`workflows : ${workflow.workflows.join('->')}`);
    workflow.start(ctx).then((context: KoaContext) => {
      end(context);
    }).catch((context: KoaContext) => {
      console.error(context.curr.error);
      end(context);
    });
  });
  const port = config.get('port', 3000);
  koa.listen(port);
  console.log('start');
};

start();
