import {
  KoaContext,
} from '../framework';

import { error } from '../response';
import CryptoJS = require('crypto-js');

const signHeaders = [
  'content-length',
  'content-md5',
  'content-type',
  'host',
  'user-agent',
  'x-app-key',
  'x-signature-method',
  'x-signature-nonce',
  'x-timestamp'
];

const signatureMethods: Record<string, (str: string, secret: string) => Promise<CryptoJS.lib.WordArray>> = {
  hmacsha1: async (str: string, secret: string): Promise<CryptoJS.lib.WordArray> => {
    return CryptoJS.HmacSHA1(str, secret);
  },
  hmansha256: async (str: string, secret: string): Promise<CryptoJS.lib.WordArray> => {
    return CryptoJS.HmacSHA256(str, secret);
  }
};

const secretKey = 'test';

export const checkSignature = async (context: KoaContext): Promise<void> => {
  const headers = context.koa.request.headers;
  const requestSignature = headers['x-signature'];
  if (!requestSignature) {
    error(400, 'Lost X-Signature header');
  }
  const requestTimestamp = parseFloat(headers['x-timestamp'] ? headers['x-timestamp'] as string : '');
  if (!requestTimestamp) {
    error(400, 'Lost X-Timestamp header');
  }
  const nowTimestamp = (new Date()).valueOf();
  if (Math.abs(nowTimestamp - requestTimestamp) > 10000) {
    error(400, 'Server timestamp and request timestamp interval greater than 10 seconds. Please check that your NTP service is working properly.');
  }
  let signStr = context.koa.request.method + '\n' +
    context.koa.request.path + '\n' +
    signHeaders.map((str: string) => {
      return `${str}:${headers[str] ? headers[str] : ''}`;
    }).join(',') + '\n';
  const query = context.koa.request.query;
  signStr = signStr + Object.keys(query).sort().map((key: string) => {
    return `key:${query[key] ? query[key] : ''}`;
  }).join(',') + '\n';

  const signatureMethod = !headers['x-signature-method'] ? 'hmacsha1' : headers['x-signature-method'] as string;

  if (signatureMethods[signatureMethod]) {
    const handler = signatureMethods[signatureMethod];
    const signature = await handler(signStr, secretKey);
    if (signature.toString() !== requestSignature) {
      error(400, `Signature is not matched. string on server to sign is "${signStr}"`);
    }
  } else {
    error(400, `Unsupported signature method: ${signatureMethod}. Only supported ${Object.keys(signatureMethods).join(',')}`);
  }
};
