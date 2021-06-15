import { HttpResponse } from './response';

export class Controller {
  format = 'json';
  response(data: unknown, code = '200', status = 200, headers = {}): never {
    throw new HttpResponse(data, code, status, headers);
  }
}
