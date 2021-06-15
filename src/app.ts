import { KoaContext } from '../index';

const middleware = async (context: KoaContext): Promise<void> => {
  console.log('1');
};

const validate = async (context: KoaContext): Promise<void> => {
  console.log('2');
};

const controller = async (context: KoaContext): Promise<void> => {
  console.log('3');
};

const response = async (context: KoaContext): Promise<void> => {
  console.log('4');
};

export {
  middleware,
  validate,
  controller,
  response
};
