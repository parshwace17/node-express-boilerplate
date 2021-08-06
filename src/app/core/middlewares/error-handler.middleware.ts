import * as CryptoTS from 'crypto-ts';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { Middleware, ExpressErrorMiddlewareInterface } from "routing-controllers";
import { Config } from '../config';

// Utils
import { logger } from '../logger';
import HttpException from "../helper/http-exception";

@Middleware({ type: "after" })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {

  constructor(private readonly config: Config) { }

  public error(exception: any, request: any, response: any, next: (err: any) => any) {
    logger.error('ErrorHandler: ', exception);
    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : StatusCodes.INTERNAL_SERVER_ERROR;
    let res: any = {
      success: false,
      status,
      message: getReasonPhrase(status),
      error: exception.message || exception.response,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
    // Joi validation error
    if (res.error && res.error.errors) {
      res.error = res.error.errors;
    }

    // exceptional error
    if (res.error && res.error.statusCode) {
      res.error = res.error.error;
    }

    // type error
    if (JSON.stringify(res.error) === '{}') {
      status = StatusCodes.INTERNAL_SERVER_ERROR;
      res.status = status;
      res.error = getReasonPhrase(status);
      res.message = getReasonPhrase(status);
    }

    // if unauthorized than change message
    if (res.status === StatusCodes.UNAUTHORIZED) {
      const message = res.error || 'Please login to continue';
      res.message = message;
    }


    // Forbidden routes based on role
    if (exception.httpCode === StatusCodes.FORBIDDEN) {
      status = StatusCodes.FORBIDDEN;
      res.status = status;
      res.message = getReasonPhrase(status);
    }

    if (exception.status === StatusCodes.UNAUTHORIZED || exception.name === 'JsonWebTokenError') {
      status = StatusCodes.UNAUTHORIZED;
      res.status = status;
      const message = res.error || 'Please login to continue';
      res.message = message;
    }

    // class validator
    if (exception && exception.httpCode === StatusCodes.BAD_REQUEST) {
      status = StatusCodes.UNPROCESSABLE_ENTITY;
      res.status = status;
      res.error = getReasonPhrase(status);
      const msgObj = exception.errors.map((e: any) => {
        return {
          property: e.property,
          constraints: e.constraints
        }
      });
      res.message = msgObj;
    }

    // Req Data parse error
    if (exception.type === 'entity.parse.failed') {
      status = StatusCodes.BAD_REQUEST;
      res.status = status;
      res.message = getReasonPhrase(status);
    }

    // Encrypt response of auth routes.
    if (this.config.get('CRYPTO_STATUS') === 'true') {
      if (request.url.includes('/auth')) {
        try {
          const encryptedBody = CryptoTS.AES.encrypt(
            JSON.stringify(res),
            request.headers['device-id'],
          ).toString();
          res = { 'payload': encryptedBody };
        } catch (e) {
          res.error = 'Error in encryption (decryptor middleware)';
        }
      }
    }

    response.status(status).json(res);
  }

}