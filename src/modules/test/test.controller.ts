import {
  KoaContext,
} from '../../framework';
import { StatusCode, success, failed, response } from '../..';

const index = async (): Promise<void> => {
  success('hello world');
};

const route = async (context: KoaContext): Promise<void> => {
  response({
    app_id: context.app_id,
    test: 'test content',
    router: context.router
  }, StatusCode.success, 200);
};

const internal = async (): Promise<void> => {
  throw new Error('Internal Error');
};

const notFound = async (): Promise<void> => {
  failed(404, StatusCode.notFound);
};

const sign = async (): Promise<void> => {
  response('check signature successfully', StatusCode.success, 200);
};


export default {
  sign,
  index,
  route,
  internal,
  notFound,
};
