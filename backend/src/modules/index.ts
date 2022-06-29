import test from './test/test.routes';
import { Router } from '../framework';

const root = new Router('/v0');
root.add(test);

export default root;
