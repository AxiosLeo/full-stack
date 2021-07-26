# Project for study Typescript 

## Start web server

```bash
npm install
npm run dev
```

## Configuration

change [index.ts](./index.ts) file to set configuration like following:

```typescript
import { config, paths } from './src/framework';
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
```
