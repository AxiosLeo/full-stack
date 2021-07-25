import { KoaContext, StatusCode, HttpResponse } from '../../framework';

export const index = async (context: KoaContext): Promise<void> => {
  throw new HttpResponse({
    app_id: context.app_id,
    test: 'test content'
  }, StatusCode.unknown);
};
