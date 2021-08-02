import {
  RESTfulHttpMethod,
} from './types';

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

export class HttpResponse extends Error {
  status: number
  data: Record<string, unknown> = {}
  headers: Record<string, string>
  format = 'json'
  constructor(httpStatus: number, data: Record<string, unknown>, headers: Record<string, string> = {}) {
    super();
    this.headers = headers;
    this.status = httpStatus;
    this.data = data;
  }
}

