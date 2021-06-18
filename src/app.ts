import { KoaContext, StatusCode } from './types';
import { config } from './config';

import { HttpResponse } from './core/response';
import * as modules from './modules';
modules.loadModules();
/**
 * Do global events
 * @param context 
 */
const begin = async (context: KoaContext): Promise<void> => {
  console.log(context.app_id);
  console.log(config.events);
};

/**
 * Exec some middleware functions
 * @example check auth
 * @param context 
 */
const middleware = async (context: KoaContext): Promise<void> => {
  // console.log('1');
  // console.log(context.app_id, config.app_id);
};

/**
 * validate request parameters
 * @param context 
 */
const validate = async (context: KoaContext): Promise<void> => {
  // console.log('2');
  // const req = context.app.req;
  // console.log(parseUrlParts(req.url ? `http://${req.headers.host}${req.url}` : `http://${req.headers.host}/`), req.headers, req.method);
};

/**
 * exec controller for sigle API
 * @param context
 */
const controller = async (context: KoaContext): Promise<void> => {
  // const req = context.app.req;
  // console.log(req);
  throw new HttpResponse('111222', StatusCode.notFoundDataFile);
};

export {
  begin,
  middleware,
  validate,
  controller
};
