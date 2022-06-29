import { KoaContext, AppLifecycle } from './types';
import { listen } from './events';
import { helper } from '@axiosleo/cli-tool';

/**
 * Do global events
 * @param context 
 */
const begin = async (context: KoaContext): Promise<void> => {
  await listen(AppLifecycle.RECEIVE, context);
};

/**
 * Exec some middleware functions
 * @example check auth
 * @param context 
 */
const middleware = async (context: KoaContext): Promise<void> => {
  await listen(AppLifecycle.MIDDLEWARE, context);

  // exec middleware by routes configuration
  if (context.router && context.router.middlewares && context.router.middlewares.length > 0) {
    await helper.cmd._sync_foreach(context.router.middlewares, async (middleware) => {
      await middleware(context);
    });
  }
};

/**
 * validate request parameters
 * @param context 
 */
const validate = async (context: KoaContext): Promise<void> => {
  await listen(AppLifecycle.VALIDATE, context);
};

/**
 * exec controller for sigle API
 * @param context
 */
const handle = async (context: KoaContext): Promise<void> => {
  await listen(AppLifecycle.CONTROLLER, context);
  const handlers = context.router?.handlers;
  if (handlers && handlers.length) {
    await helper.cmd._sync_foreach(handlers, async (handler) => {
      await handler(context);
    });
  } else {
    await listen(AppLifecycle.NOT_FOUND, context);
  }
};

export {
  begin,
  middleware,
  validate,
  handle,
};
