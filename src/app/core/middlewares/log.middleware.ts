import * as express from 'express';
import * as morgan from 'morgan';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

// Utils
import { Config } from "../config";
import { logger } from '../logger';

@Middleware({ type: 'before' })
export class LogMiddleware implements ExpressMiddlewareInterface {
    constructor(
        private readonly config: Config,
    ) { }

    public use(req: express.Request, res: express.Response, next: express.NextFunction): any {
        return morgan(this.config.get('LOG_OUTPUT'), {
            stream: {
                write: logger.info.bind(logger),
            },
        })(req, res, next);
    }

}
