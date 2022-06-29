import { StatusCode, response, result, success, failed, error } from '../response';
import { QueryHandler, businessDB, mainDB } from '../database/mysql';
import os from 'os';
export interface ControllerInterface {
  response(data: unknown, code?: StatusCode, status?: number, headers?: Record<string, string>): void;
  result(data: unknown, status?: number, headers?: Record<string, string>): void;
  success(data?: unknown, headers?: Record<string, string>): void;
  failed(data?: unknown, code?: StatusCode, status?: number, headers?: Record<string, string>): void;
  error(status: number, msg: string, headers?: Record<string, string>): void;
  dump(...data: any): void;
}

export class Controller implements ControllerInterface {
  response(data: unknown, code: StatusCode = StatusCode.success, status = 200, headers?: Record<string, string>): void {
    response(data, code, status, headers);
  }

  result(data: unknown, status = 200, headers?: Record<string, string>): void {
    result(data, status, headers);
  }

  success(data: unknown = {}, headers?: Record<string, string>): void {
    success(data, headers);
  }

  failed(data: unknown = {}, code: StatusCode = StatusCode.failed, status = 501, headers?: Record<string, string>): void {
    failed(data, code, status, headers);
  }

  error(status: number, msg: string, headers?: Record<string, string>): void {
    error(status, msg, headers);
  }

  dump(...data: any): void {
    const stack = (new Error()).stack;
    if (stack) {
      const tmp = stack.split('\n');
      const local = tmp[2].indexOf('at Object.jump') > -1 ? tmp[3] : tmp[2];
      const color = '38;5;243';
      const label = 'dump';
      process.stdout.write(`\x1b[${color}m${label} ${local.trim()}\x1b[0m${os.EOL}`);
    }
    // eslint-disable-next-line no-console
    console.log.apply(this, data);
  }
}

export class MainController extends Controller {
  mainDB: QueryHandler;
  constructor() {
    super();
    this.mainDB = new QueryHandler(mainDB());
  }
}

export class BusinessController extends MainController {
  companyCode: string;
  businessDB: QueryHandler;
  constructor(companyCode: string | undefined) {
    super();
    if (!companyCode) {
      this.error(400, 'companyCode is required');
    }
    this.companyCode = companyCode!;
    this.businessDB = new QueryHandler(businessDB(this.companyCode));
  }
}
