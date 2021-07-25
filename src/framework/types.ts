/* eslint-disable no-unused-vars */
import Koa from 'koa';

import { Context } from '@axiosleo/cli-tool';

export enum RESTfulHttpMethod {
  All = 'Any',
  Create = 'POST',
  Read = 'GET',
  Update = 'PUT',
  Delete = 'DELETE',
}

export interface RouteInfo {
  method: RESTfulHttpMethod;
  pattern: string;
  params: {
    [key: string]: string;
  };
  intro: string;
  handler: any;
}

export interface RouteItem {
  path: string,
  method: string,
  handler: any,
  intro?: string
}

export interface KoaContext extends Context {
  app: Koa.ParameterizedContext,
  app_id: string,
  method: RESTfulHttpMethod,
  url: string,
  router?: RouteInfo
}

export interface AppConfiguration {
  debug: boolean,
  port: number,
  app_id: string,
  events: Array<any>,
  middleware: Array<any>,
  validator: Array<any>,
  routes: any,
}

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
  unknown = '000;Unknown Error',
  success = '200;Success',
  notFound = '404;Not Found',

  // module code : 1
  notFoundDataFile = '1-404;Not Found Data File'
}
