import { KoaContext } from '../index';

const middleware = async (context: KoaContext): Promise<void> => {
  console.log(context);
};

const validate = async (context: KoaContext): Promise<void> => {
  console.log(context);
};

const controller = async (context: KoaContext): Promise<void> => {
  context.response.body = context.response.body + '3';
  console.log(context.response);
  console.log(3);
};

export {
  middleware,
  validate,
  controller
};
