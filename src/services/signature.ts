import Koa from 'koa';
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

export const signatureMethods: Record<string, (str: string, secret: string) => Promise<CryptoJS.lib.WordArray>> = {
  hmacsha1: async (str: string, secret: string): Promise<CryptoJS.lib.WordArray> => {
    return CryptoJS.HmacSHA1(str, secret);
  },
  hmacsha256: async (str: string, secret: string): Promise<CryptoJS.lib.WordArray> => {
    return CryptoJS.HmacSHA256(str, secret);
  }
};

export const supportedSignatureMethods = async (signatureMethod: string) => {
  return signatureMethods[signatureMethod] ? true : false;
};

export const makeSignatureString = async (request: Koa.Request) => {
  const headers = request.headers;
  const method = request.method;
  const pathinfo = request.path;
  const query = request.query;

  let signStr = method + '\n' +
    pathinfo + '\n' +
    signHeaders.map((str: string) => {
      return `${str}:${headers[str] ? headers[str] : ''}`;
    }).join(',') + '\n';
  signStr = signStr + Object.keys(query).sort().map((key: string) => {
    return `key:${query[key] ? query[key] : ''}`;
  }).join(',') + '\n';
  return signStr;
};

export const makeSignature = async (signStr: string, secretKey: string, signatureMethod: string): Promise<string> => {
  const handler = signatureMethods[signatureMethod];
  const signature = await handler(signStr, secretKey);
  return signature.toString();
};
