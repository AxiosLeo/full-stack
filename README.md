# Project for study Typescript 

## Start web server

```bash
npm install
npm run dev
```

## Configuration

change [index.ts](./index.ts) file to start application:

```typescript
import { Application } from './src/framework';

const app = new Application({
  debug: false,
  port: port,
  app_id: '',
});
app.start([rootRouter]);
```
