import Container from 'typedi';
import { Config } from '../config';
import { createLogger, format, transports } from "winston";

const config = Container.get(Config);
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, stack, timestamp, serverInfo }) => {
    return `${timestamp} [${serverInfo}] [${label}] ${level}: ${message}  ${stack ? `\n${stack}` : ''}`;
});

export const logger = createLogger({
    level: 'info',
    format: combine(
        label({ label: config.get('APP_NAME') }),
        timestamp(),
        myFormat
    ),
    defaultMeta: { serverInfo: config.get('SERVER_ID') },
    transports: [
        new transports.File({
            filename: 'logs/error.log',
            level: 'error'
        })
    ]
});

if (config.get('LOG_CONSOLE') === 'true') {
    logger.add(new transports.Console());
}
