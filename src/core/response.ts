import {
  StatusCode,
  KoaContext,
  HttpStatusCode,
  HttpErrorStatusCode
} from '../types';

import {
  v4 as uuidv4,
  v5 as uuidv5
} from 'uuid';

import { config } from '../config';

export class HttpResponse extends Error {
  status: number
  result: Record<string, unknown>
  headers: Record<string, string>
  constructor(data: unknown, code: StatusCode, status: HttpStatusCode = 200, headers = {}) {
    super();
    this.headers = headers;
    this.status = status;
    const [c, m] = code.split(';');
    this.result = {
      code: `app-${c}`,
      msg: `${m ? m : ''}`,
      data,
      request_id: uuidv5(uuidv4(), config.app_id),
    };
    console.log(this.result);
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
  constructor(code: StatusCode = StatusCode.unknownError, headers = {}) {
    super(code, 500, headers);
  }
}

export const resolve = (context: KoaContext, response: HttpResponse, format = 'json'): void => {
  context.app.type = format;
  response.result.request_id = context.request_id;
  context.app.body = JSON.stringify(response.result);
};
