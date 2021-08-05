import { KoaContext, AppLifecycle } from './types';
import { getRouteInfo } from './internal';
import { listen } from './events';
import { helper } from '@axiosleo/cli-tool';

/**
 * Do global events
 * @param context 
 */
const begin = async (context: KoaContext): Promise<void> => {
  await listen(AppLifecycle.RECEIVE, context);
  const router = getRouteInfo(context.url, context.method);
  if (router) {
    context.router = router;
  } else {
    listen(AppLifecycle.NOT_FOUND, context);
  }
};

/**
 * Exec some middleware functions
 * @example check auth
 * @param context 
 */
const middleware = async (context: KoaContext): Promise<void> => {
  await listen(AppLifecycle.MIDDLEWARE, context);

  // exec middleware by routes configuration
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
const controller = async (context: KoaContext): Promise<void> => {
  await listen(AppLifecycle.CONTROLLER, context);
  const handlers = context.router?.handlers;
  if (handlers && handlers.length) {
    await helper.cmd._sync_foreach(handlers, async (handler) => {
      await handler(context);
    });
  }
};

export {
  begin,
  middleware,
  validate,
  controller,
};
