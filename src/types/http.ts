/* eslint-disable no-unused-vars */

export type HttpSucceededCode = 200 | 201;
export type HttpErrorStatusCode = 400 | 401 | 403 | 404 | 409 | 500;
export type HttpStatusCode = HttpSucceededCode | HttpErrorStatusCode;

/**
 * status code for request
 * @example <status-code>;<code-message>
 */
export enum StatusCode {
  // common code : 0
  unknownError = '0-000;unknown error',
  success = '0-200;success',

  // module code : 1
  notFoundDataFile = '1-404;Not Found Data File'
}

export enum RESTfulHttpMethod {
  Create = 'POST',
  Read = 'GET',
  Update = 'PUT',
  Delete = 'DELETE',
}
