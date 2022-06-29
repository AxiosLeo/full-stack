import {
  KoaContext,
  Model
} from '../../framework';
import { Test } from '../../models';
import { StatusCode, success, failed, response } from '../../response';

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

const validate = async (context: KoaContext): Promise<void> => {
  const model = Model.create<Test>(context.koa.request.query, {
    test: 'required',
    abc: 'required|integer|min:18',
    email: 'required|email'
  });
  success(model);
};

export default {
  sign,
  index,
  route,
  internal,
  notFound,
  validate
};
