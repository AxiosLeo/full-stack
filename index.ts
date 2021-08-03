import { config, Application } from './src/framework';
import cluster from 'cluster';
import { cpus } from 'os';
import { rootRouter } from './src/modules';
import { printer } from '@axiosleo/cli-tool';

const numCPUs = cpus().length;

config.debug = process.env.DEBUG ? true : false;
config.routes = [rootRouter];

if (cluster.isMaster) {
  printer.println().green('start on ')
    .println(`http://localhost:${config.port}`)
    .println();
  const count = !config.count ? numCPUs : config.count;
  for (let i = 0; i < count; i++) {
    cluster.fork();
  }
  cluster.on('listening', (worker,address) => {
    console.log(`Worker ${worker.process.pid} listening : ` + address.port);
  });
  cluster.on('message', (worker) => {
    console.log(`Worker ${worker.process.pid} get message`);
  });
  cluster.on('disconnect', (worker) => {
    console.log(`Worker ${worker.process.pid} disconnect.`);
  });
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`);
    console.log('Starting a new worker...');
    cluster.fork();
  });
} else {
  const app = new Application(config.port, config.app_id);
  app.start();
}
