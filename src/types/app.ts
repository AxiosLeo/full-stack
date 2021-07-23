import Koa from 'koa';

import { Context } from '@axiosleo/cli-tool';
import { RESTfulHttpMethod } from './http';


export interface RouteInfo {
  method: RESTfulHttpMethod;
  pattern: string;
  params: {
    [key: string]: string;
  };
  intro: string;
  handler: string;
}

export interface KoaContext extends Context {
  app: Koa.ParameterizedContext,
  app_id: string,
  method: RESTfulHttpMethod,
  url: string,
  router?: RouteInfo
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

export interface RouteItem {
  path: string,
  method: string,
  handler: string,
  intro?: string
}
