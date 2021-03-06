import CryptoJS = require('crypto-js');
import { IncomingHttpHeaders } from 'http';
import { ParsedUrlQuery } from 'querystring';

const signHeaders = [
  'content-length',
  'content-md5',
  'content-type',
  'host',
  'user-agent',
  'x-access-key-id',
  'x-signature-method',
  'x-signature-nonce',
  'x-timestamp'
];

export const signatureMethods: Record<string, (str: string, secret: string) => CryptoJS.lib.WordArray> = {
  hmacsha1: (str: string, secret: string): CryptoJS.lib.WordArray => {
    return CryptoJS.HmacSHA1(str, secret);
  },
  hmacsha256: (str: string, secret: string): CryptoJS.lib.WordArray => {
    return CryptoJS.HmacSHA256(str, secret);
  },
  hmacsha512: (str: string, secret: string): CryptoJS.lib.WordArray => {
    return CryptoJS.HmacSHA512(str, secret);
  }
};

export const supportedSignatureMethods = async (signatureMethod: string) => {
  return signatureMethods[signatureMethod] ? true : false;
};

export const generateSignatureStr = async (
  method: string,
  pathinfo: string,
  headers: IncomingHttpHeaders,
  query: ParsedUrlQuery
): Promise<string> => {
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
  const signature = handler(signStr, secretKey);
  return signature.toString();
};
