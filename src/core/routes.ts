import {
  RESTfulHttpMethod,
  RouteItem,
} from '../types';
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

export let routes: any = {};

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
  const trace = resolvePathinfo(pathinfo);
  let curr = routes;
  trace.forEach((t: string, index: number) => {
    // has key
    if (curr[t]) {
      curr = curr[t];
    }
  });
  return;
};

export const resolveRoutesConfig = (routes: RouteItem[]) => {
  const result: any = {};
  routes.forEach((route: RouteItem): void => {
    const pathinfo = route.path;
    const trace: string[] = resolvePathinfo(pathinfo);
    const params: string[] = [];
    let curr: any = result;
    trace.forEach((t: string): void => {
      if (!t) {
        throw new Error('Invalid route path configuration : ' + pathinfo);
      }
      let key: string;
      if (t.indexOf('{:') === 0) {
        key = '*';
        params.push(t.substr(2, t.length - 3));
      } else {
        key = t;
      }
      if (!curr[key]) {
        curr[key] = {};
      }
      curr = curr[key];
    });
    curr['__route___'] = { ...route, params };
  });
  return result;
}

// resolve routes
// @example /a/{:aValue}/b/{:bValue}
// @example /a/**/b/**
// @example /a/***
if (config.routes && config.routes.length > 0 && !routes) {
  routes = resolveRoutesConfig(config.routes);
}
