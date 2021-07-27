import { config } from './config';
import {
  RouteItem,
  RouteInfo,
  RESTfulHttpMethod
} from './types';

export const nodes = {
  controller: {

  }
};

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

export const addRoute = (route: RouteItem): void => {
  const pathinfo = route.path;
  const trace: string[] = resolvePathinfo(pathinfo);
  const params: string[] = [];
  let curr: any = config.routes;
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
};

const resolveRouteInfo = (route: RouteItem, method: string, params: string[]): RouteInfo | null => {
  const methods = route.method.toUpperCase().split('|');
  if (methods.indexOf('ANY') > -1 || methods.indexOf(method) > -1) {
    const routeInfo: RouteInfo = {
      method: method as RESTfulHttpMethod,
      pattern: route.path,
      params: {},
      intro: route.intro,
      handler: route.handler
    };
    if (route.params) {
      route.params.forEach((item: string, index: number) => {
        if (typeof params[index] !== 'undefined') {
          routeInfo.params[item] = params[index];
        }
      });
    }
    return routeInfo;
  }
  return null;
};

export const getRouteInfo = (pathinfo: string, method: string): RouteInfo | null => {
  const trace = resolvePathinfo(pathinfo);
  let curr = config.routes;
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
      break;
    } else {
      curr = null;
      break;
    }
  }
  if (curr && curr['__route___']) {
    return resolveRouteInfo(curr['__route___'] as RouteItem, method, params);
  }
  return null;
};
