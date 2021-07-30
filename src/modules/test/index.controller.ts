import {
  HttpError,
  KoaContext,
  StatusCode,
  HttpResponse,
} from '../../framework';

export const index = async (): Promise<void> => {
  throw new HttpResponse('hello world', StatusCode.success);
};

export const route = async (context: KoaContext): Promise<void> => {
  throw new HttpResponse({
    app_id: context.app_id,
    test: 'test content',
    router: context.router
  }, StatusCode.success);
};

export const internal = async (context: KoaContext): Promise<void> => {
  throw new Error('Internal Error');
};

export const notFound = async (): Promise<void> => {
  throw new HttpError(StatusCode.notFound, 404);
};
