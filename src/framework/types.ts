/* eslint-disable no-unused-vars */
import Koa from 'koa';

import { Context } from '@axiosleo/cli-tool';
import { Router } from './routes';

export enum RESTfulHttpMethod {
  All = 'Any',
  Create = 'POST',
  Read = 'GET',
  Update = 'PUT',
  Delete = 'DELETE',
}

export interface KoaContext extends Context {
  app: Koa.ParameterizedContext,
  app_id: string,
  method: RESTfulHttpMethod,
  url: string,
}

export type ContextHandler = (context: KoaContext) => Promise<void>;

export interface RouterInfo {
  pathinfo: string;
  handlers: ContextHandler[];
  params: {
    [key: string]: string;
  };
}

export interface RouterOptions {
  method: string,
  handlers: ContextHandler[],
  intro?: string,
  routers?: Router[],
}

export interface RouteItem {
  path: string,
  method: string,
  handler: any,
  params?: string[],
  intro?: string
}

export interface AppConfiguration {
  debug: boolean,
  port: number,
  app_id: string,
  events: Array<any>,
  middleware: Array<any>,
  validator: Array<any>,
  routes: Router[],
}
