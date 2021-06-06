import { KoaContext } from '../index';

const middleware = async (context: KoaContext): Promise<void> => {
  context.app.body = '1';
  console.log('1');
};

const validate = async (context: KoaContext): Promise<void> => {
  context.app.body = '2';
  console.log('2');
};

const controller = async (context: KoaContext): Promise<void> => {
  context.app.body = '3';
  console.log('3');
};

const response = async (context: KoaContext): Promise<void> => {
  context.app.body = '444';
  console.log('4');
};

export {
  middleware,
  validate,
  controller,
  response
};
