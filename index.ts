import { start, config, paths } from '@axiosleo/koan';
import * as path from 'path';
Object.assign(config, {
  debug: true,
  port: 3333,
});
const root = path.join(__dirname, '../../');
Object.assign(paths, {
  root: root,
  cache: path.join(root, 'runtime/'),
  locales: path.join(root, 'locales'),
});
start();
