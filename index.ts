import { Application } from './src/framework';
import cluster from 'cluster';
import { cpus } from 'os';
import { rootRouter } from './src/modules';
import { printer } from '@axiosleo/cli-tool';

const numCPUs = cpus().length;
printer.warning(`current CPU number: ${numCPUs}`);
const port = 3300;
const process_count = 1;

if (cluster.isMaster) {
  printer.println().green('start on ')
    .println(`http://localhost:${port}`)
    .println();

  for (let i = 0; i < process_count; i++) {
    cluster.fork();
  }
  cluster.on('listening', (worker, address) => {
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
  const app = new Application({
    debug: false,
    port: port,
    app_id: '',
  });
  app.start([rootRouter]);
}
