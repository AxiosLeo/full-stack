/* eslint-disable no-unused-vars */
import Koa from 'koa';
import KoaStaticServer from 'koa-static-server';

import { Context } from '@axiosleo/cli-tool';
import { Router } from './routes';
import { Application } from './index';

export const AppLifecycle = {
  START: 'start',
  RECEIVE: 'receive',
  MIDDLEWARE: 'middleware',
  VALIDATE: 'validate',
  CONTROLLER: 'controller',
  RESPONSE: 'response',
  ERROR: 'error',
  NOT_FOUND: 'notFound',
  DONE: 'done',
};

export interface KoaContext extends Context {
  app: Application,
  koa: Koa.ParameterizedContext,
  app_id: string,
  method: string,
  url: string,
}

export type ContextHandler = (context: KoaContext) => Promise<void>;

export interface RouterInfo {
  pathinfo: string;
  handlers: ContextHandler[];
  middlewares: ContextHandler[];
  params: {
    [key: string]: string;
  };
}

export interface RouterOptions {
  method?: string,
  handlers?: ContextHandler[],
  middlewares?: ContextHandler[],
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

export interface AppPaths {
  root: string;
  cache?: string;
  locales?: string;
}

export interface AppConfiguration {
  [key: string]: any;
  debug?: boolean,
  count?: number,
  port?: number,
  app_id?: string,
  paths?: Record<string, string>,
  routers?: Router[],
  server?: {
    env?: string | undefined,
    keys?: string[] | undefined,
    proxy?: boolean | undefined,
    subdomainOffset?: number | undefined,
    proxyIpHeader?: string | undefined,
    maxIpsCount?: number | undefined,
    static?: KoaStaticServer.Options
  }
}
