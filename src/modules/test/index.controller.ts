import {
  KoaContext,
} from '../../framework';
import { StatusCode, success, failed, response } from '../';

export const index = async (): Promise<void> => {
  success('hello world');
};

export const route = async (context: KoaContext): Promise<void> => {
  response({
    app_id: context.app_id,
    test: 'test content',
    router: context.router
  }, StatusCode.success, 200);
};

export const internal = async (context: KoaContext): Promise<void> => {
  throw new Error('Internal Error');
};

export const notFound = async (): Promise<void> => {
  failed(404, StatusCode.notFound);
};
