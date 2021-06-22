import {
  RESTfulHttpMethod
} from '../types';

import { Middleware } from './middleware';
import { Validator } from './validation';
import { Controller } from './controller';

/**
 * Router by RESTfulHttpMethod and pattern configuration
 */
export class Router {
  method: RESTfulHttpMethod;
  pattern: string;
  middlewares: Middleware[] = [];
  validators: Validator[] = [];
  controllers: Controller[] = [];
  constructor(method: RESTfulHttpMethod, pattern: string) {
    this.method = method;
    this.pattern = pattern;
  }
  registerMiddlewares(...middlewares: Middleware[]): void {
    this.middlewares = middlewares;
  }
  registerValidation(...validators: Validator[]): void {
    this.validators = validators;
  }
  registerControllers(...controllers: Controller[]): void {
    this.controllers = controllers;
  }
}

export const routes: Record<string, Router> = {};

export const getRouteInfo = (method: string, path: string): Router | void => {
  return;
};
