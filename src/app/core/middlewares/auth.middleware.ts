import { omit } from "lodash";
import { NextFunction } from "express";
import { Middleware } from "routing-controllers";

// Utils
import { Config } from "../config";
import { JwtService } from "../services/jwt.service";
import { throwAnError } from "../helper/response-handler";

@Middleware({ type: 'before' })
export class AuthMiddleware {
    constructor(
        private readonly config: Config,
        private readonly jwtService: JwtService,
    ) { }

    async use(req: any, res: any, next: NextFunction) {
        try {
            let token;
            token = req.cookies.token;
            /* const authHeaders = req.headers.authorization;
            if (authHeaders) token = (authHeaders as string).split(' ')[1]; */

            if (token) {
                const decoded: any = await this.jwtService.verify(token);
                const user = await this.jwtService.validate(decoded);
                const deviceId = req.headers['device-id'];
                if (decoded && deviceId && decoded.deviceId !== deviceId) {
                    throw this.config.MESSAGES.UNAUTHORIZED;
                }
                if (user && !user.status) throw this.config.MESSAGES.UNAUTHORIZED;
                if (user) req.user = omit(user, 'password');
                next();
            } else {
                throw this.config.MESSAGES.UNAUTHORIZED;
            }
        } catch (error) {
            if (req.url.includes('/logout')) {
                return next();
            }
            if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
                throw throwAnError(this.config.MESSAGES.UNAUTHORIZED);
            }
            throw throwAnError(error);
        }
    }
}