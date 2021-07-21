/* eslint-disable no-unused-vars */

export type HttpSucceededCode = 200 | 201;
export type HttpErrorStatusCode = 400 | 401 | 403 | 404 | 409 | 500;
export type HttpStatusCode = HttpSucceededCode | HttpErrorStatusCode;
export type HttpResponseFormat = 'json' | 'xml' | 'raw' | 'jsonp';

/**
 * status code for request
 * @example <status-code>;<code-message>
 */
export enum StatusCode {
  // common code
  unknownError = '000;Unknown Error',
  success = '200;Success',
  notFound = '404;Not Found',

  // module code : 1
  notFoundDataFile = '1-404;Not Found Data File'
}

export enum RESTfulHttpMethod {
  All = 'Any',
  Create = 'POST',
  Read = 'GET',
  Update = 'PUT',
  Delete = 'DELETE',
}
