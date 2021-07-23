import { KoaContext, StatusCode } from '../../types';
import { HttpResponse } from '../../response';

export const index = async (context: KoaContext): Promise<void> => {
  throw new HttpResponse({
    app_id: context.app_id
  }, StatusCode.unknown);
};
