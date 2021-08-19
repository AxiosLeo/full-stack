
import cluster from 'cluster';
import { cpus } from 'os';
import { printer } from '@axiosleo/cli-tool';
import { start } from './src';

const numCPUs = cpus().length;
const port = 3300;
const debug = process.env.DEBUG ? true : false;
const process_count = 1;

if (cluster.isMaster) {
  printer.yellow(`current CPU number: ${numCPUs}`).println().println();
  printer.green('start on ')
    .println(`http://localhost:${port}`);
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
  start(port, debug);
}
