
import {
  RouterInfo,
  ContextHandler,
} from './types';

import { Router } from './routes';

interface RouterItem {
  prefix: string;
  params: string[];
  router: Router;
  middlewares: ContextHandler[];
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

export const resolveRouters = (routes: Router[]): any => {
  const routers: any = {};
  const recur = (prefix: string, router: Router, middlewares: ContextHandler[]) => {
    const middlewaresClone = router.middlewares && router.middlewares.length > 0 ?
      middlewares.concat(router.middlewares) : middlewares.concat();
    prefix = prefix + router.prefix;
    if (router.routers && router.routers.length) {
      router.routers.forEach((item: Router) => {
        recur(prefix, item, middlewaresClone);
      });
    }
    const trace = resolvePathinfo(prefix);
    const params: string[] = [];
    let curr: any = routers;
    let key = '';
    if (trace.length > 1) {
      trace.forEach((t: string): void => {
        if (t.indexOf('{:') === 0) {
          key = '*';
          params.push(t.substring(2, t.length - 1));
        } else {
          key = t;
        }
        if (!curr[key]) {
          curr[key] = {};
        }
        curr = curr[key];
      });
      if (!curr['__route___']) {
        curr['__route___'] = [
          {
            prefix,
            params,
            router,
            middlewares: middlewaresClone,
          }
        ] as RouterItem[];
      } else {
        curr['__route___'].push({
          prefix,
          params,
          router,
          middlewares: middlewaresClone,
        } as RouterItem);
      }
    }
  };
  routes.forEach(item => recur('', item, []));
  return routers;
};

const getRouter = (item: any): RouterItem[] => {
  let route: RouterItem[] = [];
  if (item && item['__route___']) {
    route = item['__route___'] as RouterItem[];
  } else if (item && item[''] && item['']['__route___']) {
    route = item['']['__route___'] as RouterItem[];
  } else if (item && item['***']) {
    return getRouter(item['***']);
  }
  return route;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getRouteInfo = (routers: any, pathinfo: string, method: string): RouterInfo | null => {
  const trace = resolvePathinfo(pathinfo);
  let curr = routers;
  let step = 0;
  const params: string[] = [];
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
  }
  const routes: RouterItem[] = getRouter(curr);
  if (routes.length) {
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      const methods = route.router.method.toUpperCase().split('|');
      if (methods.indexOf('ANY') > -1 || methods.indexOf(method) > -1) {
        const routeInfo: RouterInfo = {
          pathinfo,
          params: {},
          handlers: route.router.handlers ? route.router.handlers : [],
          middlewares: route.middlewares,
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
    }
    return null;
  }
  return null;
};
