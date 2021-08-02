import * as path from 'path';

import {
  AppConfiguration,
} from './types';

export const config: AppConfiguration = {
  debug: false,
  count: 4,
  port: 3300,
  app_id: '',
  events: [],
  middleware: [],
  validator: [],
  routes: [],
};

const root = path.join(__dirname, '../../');

export const paths = {
  root: path.join(__dirname, '../../'),
  cache: path.join(root, 'runtime/'),
  locales: path.join(root, 'locales'),
};
