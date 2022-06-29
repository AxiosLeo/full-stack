
import cluster, { Worker, Address } from 'cluster';
import { cpus } from 'os';
import { printer } from '@axiosleo/cli-tool';
import { OpenAPIApplication } from './app';

const numCPUs = cpus().length;
const port = 3300;
const debug = process.env.APP_DEBUG ? true : false;
const process_count = 1;

if (cluster.isMaster) {
  printer.yellow(`current CPU number: ${numCPUs}`).println().println();
  printer.green(`start on ${debug ? 'debug mode ' : ''}`)
    .println(`http://localhost:${port} `);
  for (let i = 0; i < process_count; i++) {
    cluster.fork();
  }
  cluster.on('listening', (worker: Worker, address: Address) => {
    printer.yellow('worker pid: ').print(`${worker.process.pid}`)
      .yellow(' listening on ').green(`${address.port}`).println();
  });
  cluster.on('message', (worker: Worker) => {
    printer.warning(`Worker ${worker.process.pid} get message`);
  });
  cluster.on('disconnect', (worker: Worker) => {
    printer.warning(`Worker ${worker.process.pid} disconnect.`);
  });
  cluster.on('exit', (worker: Worker, code: number, signal: string) => {
    printer.warning(`Worker ${worker.process.pid} died with code: ${code} and signal: ${signal}`);
    printer.warning('Starting a new worker...');
    cluster.fork();
  });
} else {
  (new OpenAPIApplication()).start();
}
