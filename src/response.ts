import { code_message } from './utils';

export class HttpResponse extends Error {
  status: number
  result: Record<string, unknown>
  headers: Record<string, string>
  constructor(data: unknown, code = '200', status = 200, headers = {}) {
    super();
    this.headers = headers;
    this.status = status;
    this.result = {
      code: code,
      msg: code_message(code),
      data: data
    };
  }
}

export const send = (data: unknown, code = '200', status = 200, headers = {}): never => {
  throw new HttpResponse(data, code, status, headers);
};

export const success = (data: unknown, code = '200', headers = {}): never => {
  throw new HttpResponse(data, code, 200, headers);
};

