/**
 * route require elements : <module-name>/<controller-name>/<action-name>
 */
import { KoaContext } from './types';
import * as modules from './modules';
import { getRouteInfo } from './core/routes';

modules.loadModules();

import * as events from './core/events';
/**
 * Do global events
 * @param context 
 */
const begin = async (context: KoaContext): Promise<void> => {
  await events.trigger('app-begin', context);
};

/**
 * Exec some middleware functions
 * @example check auth
 * @param context 
 */
const middleware = async (context: KoaContext): Promise<void> => {
  await events.trigger('app-middleware', context);

  // exec middleware by routes configuration
  // middlewares.dispatch(context.method, context.url);
  console.log(getRouteInfo(context.url, context.app.req.method));
};

/**
 * validate request parameters
 * @param context 
 */
const validate = async (context: KoaContext): Promise<void> => {
  await events.trigger('app-validate', context);
};

/**
 * exec controller for sigle API
 * @param context
 */
const controller = async (context: KoaContext): Promise<void> => {
  await events.trigger('app-controller', context);
};

export {
  begin,
  middleware,
  validate,
  controller
};
