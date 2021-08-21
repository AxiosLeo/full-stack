import {
  KoaContext,
} from '../framework';

import { error, response, StatusCode } from '../response';

const signHeaders = [
  'user-agent',
  'host',
  'content-type',
  'content-length',
  'x-app-key',
  'x-signature-method',
  'x-timestamp'
];

// const signatureMethods = [
//   'HmacSHA1'
// ];

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
  if (nowTimestamp - requestTimestamp > 10000) {
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
  response({
    sign_string: signStr,
    nowTimestamp,
    requestTimestamp
  }, StatusCode.success, 200);
};
