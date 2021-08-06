import * as http from 'http';
import { App } from './app/app';
import { Container } from 'typedi';

import { Config } from './app/core/config';
import { logger } from "./app/core/logger";
import { CronService } from './app/core/services/cron.service';
import { MailingService } from './app/core/services/mailing.service';
import { StorageService } from './app/core/services/storage.service';

const config = Container.get(Config);

const cronService = Container.get(CronService);
cronService.runCrons();

const storageService = Container.get(StorageService);
storageService.createBuckets();

const mailingService = Container.get(MailingService);
mailingService.checkSMTP();

// Normalize port
function normalizePort(val: number | string): number {
  const DEFAULT_PORT = 3000;
  const portNumber: number = typeof val === 'string' ? parseInt(val, 10) : val;
  if (isNaN(portNumber)) return DEFAULT_PORT;
  return portNumber;
}

const app: App = new App();
const port = normalizePort(config.getNumber('APP_PORT') || process.env.PORT || 3000);
app.setPort(port);

// Server error handling
function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') throw error;
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
    default:
      throw error;
  }
}

const server = http.createServer(app.app);

// On server listening handler
function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr && addr.port}`;
  logger.info(`App started and listening on ${bind}`);
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

process.on('SIGTERM', () => {
  logger.error('Received SIGTERM, app closing...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.error('Received SIGINT, app closing...');
  process.exit(0);
});

process.on('unhandledRejection', reason => {
  logger.error(`Unhandled promise rejection thrown: `);
  logger.error(reason);
  process.exit(1);
});
