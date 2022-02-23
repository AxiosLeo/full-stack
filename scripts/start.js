'use strict';

const { App, Command } = require('@axiosleo/cli-tool');

class StartCommand extends Command {
  constructor() {
    super({
      name: 'start',
      desc: ''
    });
    this.addOption('env', 'e', 'Environment name', 'local');
  }
  async exec(args) {
    console.log('t123');
  }
}

if (require.main === module) {
  const app = new App({
    name: 'start',
    version: '0.0.1'
  });
  app.register(StartCommand);
  app.exec('start');
}
