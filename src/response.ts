import {
  HttpResponseFormat,
  StatusCode,
  KoaContext,
  HttpStatusCode,
  HttpErrorStatusCode
} from './types';

import {
  v4 as uuidv4,
  v5 as uuidv5
} from 'uuid';

import { config } from './config';

export class HttpResponse extends Error {
  status: number
  result: Record<string, unknown>
  headers: Record<string, string>
  format: HttpResponseFormat = 'json'
  constructor(data: unknown, code: StatusCode, status: HttpStatusCode = 200, headers = {}) {
    super();
    this.headers = headers;
    this.status = status;
    const [c, m] = code.split(';');
    this.result = {
      code: `${c}`,
      msg: `${m ? m : ''}`,
      // eslint-disable-next-line no-undefined
      data: data ? data : undefined,
      request_id: uuidv5(uuidv4(), config.app_id),
    };
  }
}

export class HttpError extends HttpResponse {
  constructor(code: StatusCode, status: HttpErrorStatusCode, headers = {}) {
    super(null, code, status, headers);
  }
}

export class BadDataException extends HttpError {
  constructor(code: StatusCode, headers = {}) {
    super(code, 400, headers);
  }
}

export class ServerError extends HttpError {
  constructor(code: StatusCode = StatusCode.unknown, headers = {}) {
    super(code, 500, headers);
  }
}

export const resolve = (context: KoaContext, response: HttpResponse): void => {
  context.app.type = response.format;
  context.app.body = JSON.stringify(response.result);
  context.app.response.status = response.status;
};
