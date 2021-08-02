import { config, Application } from './src/framework';
import cluster from 'cluster';
import { cpus } from 'os';
import { rootRouter } from './src/modules';

const numCPUs = cpus().length;

config.debug = true;
config.routes = [rootRouter];

if (cluster.isMaster) {
  console.log(`This machine has ${numCPUs} CPUs.`);
  for (let i = 0; i < config.count; i++) {
    cluster.fork();
  }

  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`);
    console.log('Starting a new worker...');
    cluster.fork();
  });
} else {
  // load modules before start
  const app = new Application(3333, config.app_id);
  app.start();
}
