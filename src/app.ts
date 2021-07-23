/**
 * route require elements : <module-name>/<controller-name>/<action-name>
 */
import { StatusCode, KoaContext, RESTfulHttpMethod } from './types';
import * as modules from './modules';
import { getRouteInfo } from './core/routes';
import { HttpError } from './response';

modules.loadModules();

import * as events from './core/events';
/**
 * Do global events
 * @param context 
 */
const begin = async (context: KoaContext): Promise<void> => {
  await events.trigger('app-begin', context);
  const router = getRouteInfo(context.url, context.app.req.method as RESTfulHttpMethod);
  console.log(router);
  if (router) {
    context.router = router;
  } else {
    throw new HttpError(StatusCode.notFound, 404);
  }
};

/**
 * Exec some middleware functions
 * @example check auth
 * @param context 
 */
const middleware = async (context: KoaContext): Promise<void> => {
  await events.trigger('app-middleware', context);

  // exec middleware by routes configuration
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

const end = async (): Promise<void> => {
  throw new HttpError(StatusCode.notFound, 404);
};

export {
  begin,
  middleware,
  validate,
  controller,
  end
};
