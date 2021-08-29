/* eslint-disable no-unused-vars */

import {
  HttpResponse,
} from './framework';
/**
 * status code for request
 * @example <status-code>;<code-message>
 */
export enum StatusCode {
  // common code
  unknown = '000;Unknown Error',
  success = '200;Success',
  notFound = '404;Not Found',
  error = '500;Internal Server Error',
  badData = '400;Bad Data',
  invalidSignature = '400;Invalid Signature',

  // module code : 1
  notFoundDataFile = '1-404;Not Found Data File'
}

export const response = (data: unknown, code: StatusCode, status: number, headers?: Record<string, string>): never => {
  const [c, m] = code.split(';');
  throw new HttpResponse(status, {
    code: c,
    message: m,
    data,
  }, headers ? headers : {});
};

export const success = (data: unknown, headers?: Record<string, string>): never => {
  const [c, m] = StatusCode.success.split(';');
  throw new HttpResponse(200, {
    code: c,
    message: m,
    data,
  }, headers ? headers : {});
};

export const failed = (status: number, code: StatusCode, headers?: Record<string, string>): never => {
  const [c, m] = code.split(';');
  throw new HttpResponse(status, {
    code: c,
    message: m,
    data: {},
  }, headers ? headers : {});
};

export const error = (status: number, msg: string, headers?: Record<string, string>): never => {
  throw new HttpResponse(status, {
    code: status,
    message: msg,
  }, headers ? headers : {});
};
