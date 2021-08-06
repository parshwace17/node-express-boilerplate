import * as cors from 'cors';
import * as helmet from 'helmet';
import * as express from 'express';
import { Container } from "typedi";
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { Express } from 'express-serve-static-core';
import { useExpressServer, useContainer, Action } from "routing-controllers";

import { initializeDb } from './core/db/sequilize';

// Middelware
import { checkRoles } from './core/middlewares/role.middleware';
import { ErrorHandler } from './core/middlewares/error-handler.middleware';

// Controllers
import { CommonControllers } from "./modules/common";
import { AuthController } from './modules/auth/auth.controller';
import { LogMiddleware } from './core/middlewares/log.middleware';
import { UserController } from './modules/user/user.controller';

export class App {
  public app: Express;

  constructor() {
    // init express app
    this.app = express();

    // configure application
    this.config();
  }

  public async config() {
    // middlewares
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(cookieParser());
    this.app.use(bodyParser.json());
    this.app.use(express.static('public'));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    let allowedHost: string | string[] = `${process.env.ALLOWED_HOST}`;
    allowedHost = allowedHost ? allowedHost.split(',') : '*';
    this.app.use(cors({
      origin: allowedHost,
      credentials: true,
      optionsSuccessStatus: 200
    }));

    await initializeDb();

    useContainer(Container);
    // register created express server in routing-controllers
    useExpressServer(this.app, {
      routePrefix: "/api",
      defaultErrorHandler: false,
      controllers: [
        AuthController,
        ...CommonControllers,
        UserController
      ],
      middlewares: [
        LogMiddleware,
        ErrorHandler
      ],
      authorizationChecker: async (action: Action, roles: string[]) => {
        return checkRoles(action, roles);
      },
      validation: {
        whitelist: true,
        forbidNonWhitelisted: true
      }
    });
  }

  public setPort(port: number): void {
    this.app.set('port', port);
  }
}