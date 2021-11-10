
import {
  RouterInfo,
  ContextHandler,
} from './types';

import { Router } from './routes';

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

export const resolveRouters = (routes: Router[]): void => {
  const routers: any = {};
  if (!routers['@']) {
    const recur = (prefix: string, router: Router) => {
      prefix = prefix + router.prefix;
      if (router.routers && router.routers.length) {
        router.routers.forEach((item: Router) => {
          recur(prefix, item);
        });
      }
      const trace = resolvePathinfo(prefix);
      const params: string[] = [];
      let curr: any = routers;
      trace.forEach((t: string): void => {
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
    };
    routes.forEach(item => recur('', item));
  } else {
    throw new Error('Only exec on app start');
  }
  return routers;
};

const getRouter = (item: any): RouterItem | null => {
  let route: RouterItem | null = null;
  if (item && item['__route___']) {
    route = item['__route___'] as RouterItem;
  } else if (item && item[''] && item['']['__route___']) {
    route = item['']['__route___'] as RouterItem;
  }
  return route;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getRouteInfo = (routers: any, pathinfo: string, method: string): RouterInfo | null => {
  const trace = resolvePathinfo(pathinfo);
  let curr = routers;
  let step = 0;
  const params: string[] = [];
  let middleware: ContextHandler[] = [];
  while (step < trace.length) {
    const tag = trace[step];
    step++;
    if (tag === '@') {
      if (!curr[tag]) {
        curr = null;
        break;
      }
      curr = curr[tag];
    } else if (curr[tag]) {
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
    let currRoute = getRouter(curr);
    if (currRoute && currRoute.router && currRoute.router.middleware && currRoute.router.middleware.length) {
      middleware = middleware.concat(currRoute.router.middleware);
    }
  }
  let route: RouterItem | null = getRouter(curr);
  if (route) {
    const methods = route.router.method.toUpperCase().split('|');
    if (methods.indexOf('ANY') > -1 || methods.indexOf(method) > -1) {
      const routeInfo: RouterInfo = {
        pathinfo,
        params: {},
        handlers: route.router.handlers ? route.router.handlers : [],
        middleware,
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
