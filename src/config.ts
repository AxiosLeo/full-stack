import * as path from 'path';

import { AppConfiguration } from './types';

export const config: AppConfiguration = {
  debug: false,
  port: 3000,
  app_id: '',
  events: [],
  routes: [],
  middleware: [],
  validator: [],
};
const root = path.join(__dirname, '../../');

export const paths = {
  root: root,
  cache: path.join(root, 'runtime/'),
  locales: path.join(root, 'locales'),
};
