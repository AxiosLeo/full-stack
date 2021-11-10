import {
  KoaContext,
} from '../framework';

import { error } from '../response';
import {
  makeSignature,
  generateSignatureStr,
  supportedSignatureMethods,
  signatureMethods
} from '../services/signature';

export const checkSignature = async (context: KoaContext): Promise<void> => {
  const signatureMethod = !context.koa.request.headers['x-signature-method']
    ? 'hmacsha256' : context.koa.request.headers['x-signature-method'] as string;
  const requestTimestamp = parseFloat(context.koa.request.headers['x-timestamp']
    ? context.koa.request.headers['x-timestamp'] as string : '');
  if (!requestTimestamp) {
    error(400, 'Lost X-Timestamp header');
  }
  const nowTimestamp = (new Date()).valueOf();
  if (Math.abs(nowTimestamp - requestTimestamp) > 10000) {
    error(400, 'Server timestamp and request timestamp interval greater than 10 seconds. ' +
      'Please check that your NTP service is working properly.');
  }

  if (await supportedSignatureMethods(signatureMethod)) {
    const signStr = await generateSignatureStr(
      context.koa.request.method,
      context.koa.request.path,
      context.koa.request.headers,
      context.koa.request.query,
    );
    const requestSignature = context.koa.request.headers['x-signature'];
    if (!requestSignature) {
      error(400, 'Lost X-Signature header');
    }
    const signature = await makeSignature(signStr, 'test', signatureMethod);
    if (signature !== requestSignature) {
      error(400, `Signature is not matched. string on server to sign is "${signStr}"`);
    }
  } else {
    error(400, `Unsupported signature method: ${signatureMethod}. ` +
      `Only supported ${Object.keys(signatureMethods).join(',')}`);
  }
};
