import test from './test/test.routes';

import { Router, routers } from '../framework';

const root = new Router('');
root.new('/test', test);

routers.push(root);
routers.push(test);
