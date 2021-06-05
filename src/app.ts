import { KoaContext } from '../index';

const middleware = async (context: KoaContext): Promise<void> => {
  context.response.body = '1';
  // console.log(context.response);
  console.log(1);
};

const validate = async (context: KoaContext): Promise<void> => {
  context.response.body = context.response.body + '2';
  // console.log(context.response);
  console.log(2);
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
