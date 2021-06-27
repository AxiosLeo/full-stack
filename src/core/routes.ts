import {
  RESTfulHttpMethod,
  RouteItem,
} from '../types';
import { Configuration } from '@axiosleo/cli-tool';
import { Middleware } from './middleware';
import { Validator } from './validation';
import { Controller } from './controller';
import { config } from '../config';

/**
 * Router by RESTfulHttpMethod and pattern configuration
 */
export class Router {
  method: RESTfulHttpMethod;
  pattern: string;
  middlewares: Middleware[] = [];
  validators: Validator[] = [];
  controllers: Controller[] = [];
  constructor(method: RESTfulHttpMethod, pattern: string) {
    this.method = method;
    this.pattern = pattern;
  }
  registerMiddlewares(...middlewares: Middleware[]): void {
    this.middlewares = middlewares;
  }
  registerValidation(...validators: Validator[]): void {
    this.validators = validators;
  }
  registerControllers(...controllers: Controller[]): void {
    this.controllers = controllers;
  }
}

export const routes: Configuration = new Configuration({}, '$');

const resolvePathinfo = (pathinfo: string): string[] => {
  let trace = [];
  if (!pathinfo || pathinfo === '/') {
    trace = ['@'];
  } else if (pathinfo[0] !== '/') {
    throw new Error('Invalid route path, should be start with "/". ');
  } else {
    pathinfo = '@' + pathinfo;
    trace = pathinfo.split('/');
  }
  return trace;
};

export const getRouteInfo = (pathinfo: string, method?: string): Router | void => {
  // const trace = resolvePathinfo(pathinfo);
  // const step = 0;
  // const total = trace.length;
  // const defaul = null;
  // const params: Record<string, unknown> = {};
  // let curr;
  // while (true) {
  //   curr = trace[step] ?? null;
  //   ++step;
  // }
  return;
};

// /a/{:aValue}/b/{:bValue}
// /a/*/b/*
// resolve routes
if (config.routes && config.routes.length > 0) {
  config.routes.forEach((route: RouteItem): void => {
    // const handler: string = route.handler;
    // const method = route.method;
    const pathinfo = route.path;
    const trace: string[] = resolvePathinfo(pathinfo);
    const params: string[] = [];
    const key = trace.map((t: string): string => {
      if (!t) {
        params.push('');
        return '*';
      }
      if (t.indexOf('{:') === 0) {
        params.push(t.substr(2, t.length - 3));
        return '*';
      }
      return t;
    }).join('$');
    console.log(key);
  });
}
