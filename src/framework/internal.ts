
import {
  RouterInfo,
  RESTfulHttpMethod,
} from './types';

import { Router } from './routes';
import { config } from './config';

const routers: any = {};

interface RouterItem {
  prefix: string;
  params: string[];
  router: Router;
}

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

export const resolveRouters = (): void => {
  if (!routers['@']) {
    const recur = (prefix: string, router: Router) => {
      prefix = prefix + router.prefix;
      if (router.routers && router.routers.length) {
        router.routers.forEach((item: Router) => {
          recur(prefix, item);
        });
      }
      if (router.handlers && router.handlers.length) {
        const trace = resolvePathinfo(prefix);
        const params: string[] = [];
        let curr: any = routers;
        trace.forEach((t: string): void => {
          if (!t) {
            throw new Error('Invalid route path configuration : ' + prefix);
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
        curr['__route___'] = {
          prefix,
          params,
          router
        };
      }
    };
    config.routes.forEach(item => recur('', item));
  } else {
    throw new Error('Only exec on app start');
  }
};

export const getRouteInfo = (pathinfo: string, method: RESTfulHttpMethod): RouterInfo | null => {
  const trace = resolvePathinfo(pathinfo);
  let curr = routers;
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
    const route = curr['__route___'] as RouterItem;
    const methods = route.router.method.toUpperCase().split('|');
    if (methods.indexOf('ANY') > -1 || methods.indexOf(method) > -1) {
      const routeInfo: RouterInfo = {
        pathinfo,
        params: {},
        handlers: route.router.handlers ? route.router.handlers : []
      };
      if (route.params && route.params.length) {
        route.params.forEach((item: string, index: number) => {
          if (typeof params[index] !== 'undefined') {
            routeInfo.params[item] = params[index];
          }
        });
      }
      return routeInfo;
    }
    return null;
  }
  return null;
};
