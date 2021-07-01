import * as path from 'path';

import { AppConfiguration } from './types';

export const config: AppConfiguration = {
  debug: false,
  port: 3300,
  app_id: '',
  events: [],
  routes: [
    {
      path: '/',
      method: 'get|post',
      handler: 'index/index/index',
      intro: '',
    },
    {
      path: '/test/{:id}/{:title}/foo/{:bar}', // with params
      method: 'all',                             // match all request method
      handler: 'index/index/index',
      intro: 'has param',
    },
    {
      path: '/has/**/text/{:name}',           // ** : ingore string before next '/'
      method: 'post',
      handler: 'index/index/index',
      intro: 'ignore part of path',
    },
    {
      path: '/admin/***', // *** : ignore string
      method: 'all',
      handler: 'index/index/illegal',
      intro: 'default route rule',
    },
    {
      path: '/***', // *** : ignore string
      method: 'all',
      handler: 'index/index/notFound',
      intro: 'the default route rule when none of the above rules are matched',
    }
  ],
  middleware: [],
  validator: [],
};
const root = path.join(__dirname, '../../');

export const paths = {
  root: root,
  cache: path.join(root, 'runtime/'),
  locales: path.join(root, 'locales'),
};
