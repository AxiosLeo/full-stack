export { helper } from '@axiosleo/cli-tool';

import { locales } from '@axiosleo/cli-tool';

export const trans = (msg: string, params?: Record<string, string>): string => {
  return locales.__(msg, params);
};
