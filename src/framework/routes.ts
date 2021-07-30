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
    if (!prefix) {
      throw new Error('Invalid prefix option');
    }
    if (prefix[0] !== '/') {
      prefix = '/' + prefix;
    }
    this.prefix = prefix;
    if (options) {
      this.method = options.method;
      this.handlers = options.handlers ? options.handlers : [];
      this.routers = options.routers ? options.routers : [];
    }
  }

  add(router: Router): void {
    this.routers.push(router);
  }
}
