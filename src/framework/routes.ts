import {
  RouterOptions,
  ContextHandler,
} from './types';

export class Router {
  prefix: string;
  method = '';
  routers: Router[] = [];
  handlers?: ContextHandler[];
  middleware?: ContextHandler[];
  options?: RouterOptions;

  constructor(prefix: string = '', options?: RouterOptions) {
    this.prefix = prefix;
    if (options) {
      this.method = options.method ? options.method : '';
      this.handlers = options.handlers ? options.handlers : [];
      this.routers = options.routers ? options.routers : [];
      this.middleware = options.middlewares ? options.middlewares : [];
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

export const routers: Router[] = [];
