#!/usr/bin/env node

import { program } from '@commander-js/extra-typings';
import { Server } from '@event-recorder/server';
import chalk from 'chalk';
import packageJSON from '../package.json';

program.version(packageJSON.version);

program
  .description('Starts the server and logs browser events')
  .option(
    '-p, --port <port>',
    'Specifies the server port (default: 3001)',
    '3001',
  )
  .action((cmd) => {
    const port = Number(cmd.port);
    if (isNaN(port) || port < 1 || port > 65535) {
      console.log(
        chalk.red('Error: Port must be a valid number between 1 and 65535.'),
      );
      process.exit(1);
    }

    const server = new Server({ port });
    server.start();
  });

program.parse(process.argv);
