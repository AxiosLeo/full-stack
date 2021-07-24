import { KoaContext, StatusCode } from '@axiosleo/koan';
import { HttpResponse } from '@axiosleo/koan';

export const index = async (context: KoaContext): Promise<void> => {
  throw new HttpResponse({
    app_id: context.app_id
  }, StatusCode.unknown);
};
