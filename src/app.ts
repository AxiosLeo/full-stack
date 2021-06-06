import { KoaContext } from '../index';
// import * as routes from './routes';

const middleware = async (context: KoaContext): Promise<void> => {
  console.log(context);
};

const validate = async (context: KoaContext): Promise<void> => {
  console.log(context);
};

const dispatch = async (context: KoaContext): Promise<void> => {
  context.response.body = context.response.body + '3';
  console.log(context.response);
  console.log(3);
};

export {
  middleware,
  validate,
  dispatch
};
