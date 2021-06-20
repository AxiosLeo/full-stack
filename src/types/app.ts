import Koa from 'koa';

import { Context } from '@axiosleo/cli-tool';

export interface KoaContext extends Context {
  app: Koa.ParameterizedContext,
  app_id: string
}

export interface AppConfiguration {
  debug: boolean,
  port: number,
  app_id: string,
  events: Array<any>,
  routes: Array<any>,
  middleware: Array<any>,
  validator: Array<any>,
}