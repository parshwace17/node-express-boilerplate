import { pick } from 'lodash';
import { Service } from 'typedi';
import * as jwt from "jsonwebtoken";
import { Config } from '../config';
import { AuthService } from '../../modules/auth/auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Service()
export class JwtService {

  constructor(
    private authService: AuthService,
    private readonly config: Config
  ) { }

  async verify(token: string) {
    return jwt.verify(token, this.config.get('JWT_ACCESS_TOKEN_SECRET_KEY'));
  }

  async validate(payload: JwtPayload) {
    const attributes = ['id', 'email', 'first_name', 'last_name', 'role', 'status'];
    const user = await this.authService.validateUser(payload, attributes);
    if (!user) throw this.config.MESSAGES.UNAUTHORIZED;
    return pick(user, attributes);
  }

}
