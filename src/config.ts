import { Configuration } from '@axiosleo/cli-tool';

export const config = new Configuration({
  debug: false,
  port: 3000,
  app_id: null,
  path: {
    root: process.cwd(),
    cache: 'runtime',
    config: 'config'
  }
});
