import { App, Command, ObjectItem, printer } from '@axiosleo/cli-tool';

export class TestCommand extends Command {
  constructor() {
    super({
      name: 'test',
      desc: ''
    });
  }
  async exec(args?: ObjectItem, options?: ObjectItem, argList?: string[], app?: App): Promise<void> {
    printer.println('this is test command');
  }
}