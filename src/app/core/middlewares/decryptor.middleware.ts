import * as CryptoTS from 'crypto-ts';
import { NextFunction } from "express";
import { Middleware } from "routing-controllers";
import { Config } from "../config";
import { throwAnError } from "../helper/response-handler";
import { logger } from '../logger';

@Middleware({ type: 'before' })
export class DecryptorMiddleware {
    constructor(
        private readonly config: Config,
    ) { }

    async use(req: any, res: any, next: NextFunction) {
        try {
            if (this.config.get('CRYPTO_STATUS') === 'true') {
                const deviceId = req.headers['device-id'];
                if (!deviceId) {
                    throw throwAnError(this.config.MESSAGES.BROWSER_FINGERPRINT_REQUIRED);
                }
                const bytes = CryptoTS.AES.decrypt(req.body.payload, deviceId);
                req.body = JSON.parse(bytes.toString(CryptoTS.enc.Utf8));;
            }
            next();
        } catch (error) {
            logger.error('error in decryptor catch', error);
            throw throwAnError(this.config.MESSAGES.ENCRYPTION_ERROR);
        }
    }
}