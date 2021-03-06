import {
  RouterOptions,
  ContextHandler,
} from './types';

export class Router {
  prefix: string;
  method = '';
  // eslint-disable-next-line no-use-before-define
  routers: Router[] = [];
  handlers?: ContextHandler[];
  middlewares?: ContextHandler[];
  options?: RouterOptions;

  constructor(prefix = '', options?: RouterOptions) {
    this.prefix = prefix;
    if (options) {
      this.method = options.method ? options.method : '';
      this.handlers = options.handlers ? options.handlers : [];
      this.routers = options.routers ? options.routers : [];
      this.middlewares = options.middlewares ? options.middlewares : [];
    }
  }

  add(router: Router): void {
    this.routers.push(router);
  }

  new(prefix: string, options?: RouterOptions): void {
    const router = new Router(prefix, options);
    this.add(router);
  }
}

