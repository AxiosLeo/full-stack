#!/usr/bin/env node
import { App } from '@axiosleo/cli-tool';
import * as commands from '../commands';

const app = new App({
  name: 'cli',
  version: '0.0.1',
  desc: 'CLI Tool',
  commands_sort: ['help']
});

console.log(commands);
Object.values(commands).forEach((item) => {
  app.register(item);
});

app.start();
