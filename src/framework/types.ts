/* eslint-disable no-unused-vars */
import Koa from 'koa';

import { Context } from '@axiosleo/cli-tool';
import { Router } from './routes';

export const AppLifecycle = {
  START: 'start',
  RECEIVE: 'receive',
  MIDDLEWARE: 'middleware',
  VALIDATE: 'validate',
  CONTROLLER: 'controller',
  RESPONSE: 'response',
  ERROR: 'error',
};

export class HttpResponse extends Error {
  status: number
  data: Record<string, unknown> = {}
  headers: Record<string, string>
  format = 'json'
  constructor(httpStatus: number, data: Record<string, unknown>, headers: Record<string, string> = {}) {
    super();
    this.headers = headers;
    this.status = httpStatus;
    this.data = data;
  }
}

export interface KoaContext extends Context {
  app: Koa.ParameterizedContext,
  app_id: string,
  method: string,
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
  method?: string,
  handlers?: ContextHandler[],
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
  count: number,
  port: number,
  app_id: string,
  events: Array<any>,
  middleware: Array<any>,
  validator: Array<any>,
  routes: Router[],
}
