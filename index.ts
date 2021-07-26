import { start, config, paths } from './src/framework';
import * as path from 'path';

Object.assign(config, {
  debug: true,
  port: 3333,
});

const root = __dirname;
Object.assign(paths, {
  root: root,
  cache: path.join(root, 'runtime/'),
  locales: path.join(root, 'locales'),
});

// load modules before start
export * from './src/modules';

start();
