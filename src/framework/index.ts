export * from './routes';
export * from './config';
export * as events from './events';
export * from './response';
export * from './types';

import Koa from 'koa';
import { v4 as uuidv4 } from 'uuid';
import { printer, Workflow, locales } from '@axiosleo/cli-tool';
import * as operator from './app';
import { KoaContext } from './types';
import { config, paths } from './config';
import { resolve, resolveMethod } from './response';
import { resolveRouters } from './internal';

locales.init({
  dir: paths.locales,
  sets: ['en-US', 'zh-CN']
});

if (!config.app_id) {
  config.app_id = uuidv4();
}

export const start = (): void => {
  const koa = new Koa();
  resolveRouters();
  koa.use(async (ctx: Koa.ParameterizedContext) => {
    const workflow = new Workflow<KoaContext>(operator);
    const context: KoaContext = {
      app: ctx,
      app_id: config.app_id,
      curr: {},
      step_data: {},
      method: resolveMethod(ctx.req.method),
      url: ctx.req.url ? ctx.req.url : '/'
    };
    try {
      await workflow.start(context);
    } catch (e) {
      resolve(context, e.curr.error);
    }
  });
  koa.listen(config.port);
  printer.println().green('start on ')
    .println(`http://localhost:${config.port}`)
    .println();
  printer.yellow('app_id    : ').print(config.app_id).println();
  printer.yellow('workflows : ').print(Object.keys(operator).join(' -> ')).println().println();
};
