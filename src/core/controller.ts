import { HttpResponse } from './response';
import { StatusCode, HttpStatusCode } from '../types';

export class Controller {
  format = 'json';
  response(data: unknown, code = StatusCode.success, status: HttpStatusCode = 200, headers = {}): never {
    throw new HttpResponse(data, code, status, headers);
  }
}