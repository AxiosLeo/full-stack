import {
  RouterOptions,
  ContextHandler,
} from './types';

export class Router {
  prefix: string;
  method = '';
  routers: Router[] = [];
  handlers?: ContextHandler[];
  options?: RouterOptions;

  constructor(prefix: string, options?: RouterOptions) {
    this.prefix = prefix;
    if (options) {
      this.method = options.method ? options.method : '';
      this.handlers = options.handlers ? options.handlers : [];
      this.routers = options.routers ? options.routers : [];
    }
  }

  add(router: Router): void {
    this.routers.push(router);
  }
}

export const routers: Router[] = [];
