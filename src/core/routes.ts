import {
  RouteInfo,
  RouteItem,
  RESTfulHttpMethod,
} from '../types';
import { config } from '../config';

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

export const resolveRoutesConfig = (routesItems: RouteItem[]): any => {
  const result: any = {};
  routesItems.forEach((route: RouteItem): void => {
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
};

// resolve routes
// @example /a/{:aValue}/b/{:bValue}
// @example /a/**/b/**
// @example /a/***
export const routes: any = resolveRoutesConfig(config.routes);

export const getRouteInfo = (pathinfo: string, method: string): RouteInfo | null => {
  const trace = resolvePathinfo(pathinfo);
  let curr = routes;
  let step = 0;
  const params: string[] = [];
  while (step < trace.length) {
    const tag = trace[step];
    step++;
    if (tag === '@') {
      curr = curr[tag];
      continue;
    }
    if (curr[tag]) {
      // has key
      curr = curr[tag];
    } else if (curr['*']) {
      params.push(tag);
      curr = curr['*'];
    } else if (curr['**']) {
      curr = curr['**'];
    } else if (curr['***']) {
      curr = curr['***'];
    } else {
      break;
    }
  }
  if (curr && curr['__route___']) {
    curr = curr['__route___'];
    const methods = curr['method'].split('|');
    if (methods.indexOf('all') > -1 || methods.indexOf(method) > -1) {
      const routeInfo: RouteInfo = {
        method: method as RESTfulHttpMethod,
        pattern: curr.path,
        params: {},
        intro: curr.intro,
        middlewares: [],
        validators: []
      };
      curr.params.forEach((item: string, index: number) => {
        if (typeof params[index] !== 'undefined') {
          routeInfo.params[item] = params[index];
        }
      });
      return routeInfo;
    }
  }
  return null;
};

