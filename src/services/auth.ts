import { KoaContext } from '../types';


export const checkAuth = async (context: KoaContext): Promise<void> => {
  console.log(context);
  // throw 
  return;
};
