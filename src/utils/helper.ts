export { helper } from '@axiosleo/cli-tool';
import { locales, debug as _debug } from '@axiosleo/cli-tool';

export const debug = _debug;

import {
  RESTfulHttpMethod
} from '../types';

export const trans = (msg: string, params?: Record<string, string>): string => {
  return locales.__(msg, params);
};

export const resolveMethod = (method?: string): RESTfulHttpMethod => {
  if (!method) {
    return RESTfulHttpMethod.Read;
  }
  switch (method) {
  case 'POST': return RESTfulHttpMethod.Create;
  case 'PUT': return RESTfulHttpMethod.Update;
  case 'PATCH': return RESTfulHttpMethod.Update;
  case 'DELETE': return RESTfulHttpMethod.Delete;
  default: return RESTfulHttpMethod.Read;
  }
};
