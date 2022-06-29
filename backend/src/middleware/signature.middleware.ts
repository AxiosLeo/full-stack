import {
  KoaContext,
} from '../framework';

import { error } from '../response';
import {
  makeSignature,
  generateSignatureStr,
  supportedSignatureMethods,
  signatureMethods
} from '../services/signature.service';
import app from '../services/app.service';
import { AccessKeyModel } from '../models';
import moment from 'moment';

export const checkSignature = async (context: KoaContext): Promise<void> => {
  if (process.env.DEPLOY_ENV === 'dev') {
    return;
  }
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
    const ak_id = context.koa.request.headers['x-access-key-id'] ? context.koa.request.headers['x-access-key-id'] : '';
    let access_key: AccessKeyModel | null = null;
    try {
      access_key = await app.getAccessKeyByAccessKeyID(ak_id as string);
      if (!access_key) {
        error(400, `Invalid Access key ID: ${ak_id}`);
      }
    } catch (err) {
      error(400, `Invalid Access key ID: ${ak_id}`);
    }
    if (access_key?.expired_at && access_key.expired_at * 1000 < (new Date().valueOf())) {
      error(400, `Access key expired at: ${moment(access_key.expired_at).format('YYYY-MM-DD HH:mm:ss')}`);
    }
    context.access_key_id = ak_id as string;
    context.app_key = access_key?.app_key;
    const access_key_secret = access_key?.access_key_secret || '';
    const signature = await makeSignature(signStr, access_key_secret, signatureMethod);
    if (signature !== requestSignature) {
      error(400, `Signature is not matched. string on server to sign is "${signStr}"`);
    }
  } else {
    error(400, `Unsupported signature method: ${signatureMethod}. ` +
      `Only supported ${Object.keys(signatureMethods).join(',')}`);
  }
};
