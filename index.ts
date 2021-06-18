import Koa from 'koa';
import { v4 as uuidv4 } from 'uuid';
import { Workflow, printer, locales } from '@axiosleo/cli-tool';
import { resolve } from './src/core/response';
import { KoaContext } from './src/types';
import * as operator from './src/app';
import { config, paths } from './src/config';

locales.init({
  dir: paths.locales,
  sets: ['en-US', 'zh-CN']
});

if (!config.app_id) {
  config.app_id = uuidv4();
}

export const start = (): void => {
  const koa = new Koa();
  koa.use(async (ctx: Koa.ParameterizedContext) => {
    const workflow = new Workflow<KoaContext>(operator);
    const context: KoaContext = {
      app: ctx,
      app_id: config.app_id,
      curr: {},
      step_data: {},
    };
    try {
      await workflow.start(context);
    } catch (e) {
      resolve(context, e.curr.error, 'json');
    }
  });
  koa.listen(config.port);
  printer.println().green('start on ')
    .println(`http://localhost:${config.port}`)
    .println();
  printer.yellow('app_id    : ').print(config.app_id).println();
  printer.yellow('workflows : ').print(Object.keys(operator).join(' -> ')).println().println();
};

start();
