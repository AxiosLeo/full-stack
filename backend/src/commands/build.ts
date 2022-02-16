import { Command, printer, helper } from '@axiosleo/cli-tool';
import path from 'path';

const cmd = helper.cmd;

export class BuildCommand extends Command {
  constructor() {
    super({
      name: 'build',
      desc: 'Build views&services projects'
    });
  }
  async exec(): Promise<void> {
    const cwd = path.join(__dirname, '../../');
    await cmd._exec('npm run build', cwd);
    if (await this.confirm('start now?')) {
      await cmd._exec('forever start ./dist/bootstrap.js', cwd);
    }
    printer.success('done');
  }
}
