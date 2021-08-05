import { config, Application } from './src/framework';
import cluster from 'cluster';
import { cpus } from 'os';
import { rootRouter } from './src';
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
    printer.yellow('worker pid: ').print(`${worker.process.pid}`)
      .yellow(' listening on ').green(`${address.port}`).println();
  });
  cluster.on('message', (worker) => {
    printer.warning(`Worker ${worker.process.pid} get message`);
  });
  cluster.on('disconnect', (worker) => {
    printer.warning(`Worker ${worker.process.pid} disconnect.`);
  });
  cluster.on('exit', (worker, code, signal) => {
    printer.warning(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`);
    printer.warning('Starting a new worker...');
    cluster.fork();
  });
} else {
  const app = new Application(config.port, config.app_id);
  app.start();
}
