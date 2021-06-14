import { locales } from '@axiosleo/cli-tool';
const __ = locales.__;

export const code_message = (code: string, msg = ''): string => {
  console.log(code);
  if (!code) {
    return msg;
  }
  const r = __(code);
  console.log(r);
  return code === r ? msg : r;
};
