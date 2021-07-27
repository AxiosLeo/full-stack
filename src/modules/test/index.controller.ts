import {
  HttpError,
  KoaContext,
  StatusCode,
  HttpResponse,
} from '../../framework';

export const index = async (context: KoaContext): Promise<void> => {
  throw new HttpResponse('hello world', StatusCode.success);
};


export const route = async (context: KoaContext): Promise<void> => {
  throw new HttpResponse({
    app_id: context.app_id,
    test: 'test content',
    router: context.router
  }, StatusCode.unknown);
};

export const notFound = async (context: KoaContext): Promise<void> => {
  throw new HttpError(StatusCode.unknown, 500);
};
