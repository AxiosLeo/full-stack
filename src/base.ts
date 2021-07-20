import { HttpResponse } from './core/response';
import { StatusCode, HttpStatusCode } from './types';

/**
 * Base Controller class
 */
export class Controller {
  format = 'json';
  response(data: unknown, code = StatusCode.success, status: HttpStatusCode = 200, headers = {}): never {
    throw new HttpResponse(data, code, status, headers);
  }
}

export class Middleware {

}

export class Validator {

}
