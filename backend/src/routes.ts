import { Router } from './framework';
import moduleRoutes from './modules';

const root = new Router('/openapi');

root.add(moduleRoutes);

export default root;
