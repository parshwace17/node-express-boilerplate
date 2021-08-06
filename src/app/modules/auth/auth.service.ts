import { Service } from 'typedi';
import * as jwt from "jsonwebtoken";
import { StatusCodes } from 'http-status-codes';

// sequilize instance
import { sequelize } from '../../core/db/sequilize';

// Models
import { User } from '../../models/user/user.model';

// Services
import { Config } from '../../core/config';
import { CommonService } from '../../core/services/common.service';

// Utils
import { logger } from '../../core/logger';
import { LoginUser, SignupUser } from './helpers/auth.interface';
import { JwtPayload } from '../../core/interfaces/jwt-payload.interface';
import { sendSuccessResponse, throwAnError } from '../../core/helper/response-handler';

@Service()
export class AuthService {
  userModel = sequelize.models.User;
  resetPasswordModel = sequelize.models.PasswordReset;

  constructor(
    private readonly config: Config,
    private readonly commonService: CommonService
  ) { }

  /**
   * @author Parshwa Shah
   * @description Create JWT token
   */
  async createToken(user: JwtPayload) {
    return jwt.sign(user, this.config.get('JWT_ACCESS_TOKEN_SECRET_KEY'), {
      expiresIn: this.config.getNumber('JWT_ACCESS_TOKEN_EXPIRE_TIME')
    });
  }

  /**
   * @author Parshwa Shah
   * @description Validates a user using JWT token payload
   */
  async validateUser(payload: JwtPayload, attributes: Array<string> = ['email']): Promise<any> {
    return this.findUser('email', payload.email, attributes);
  }

  /**
   * @author Parshwa Shah
   * @description Create Payload
   */
  createPayload(user: User) {
    return {
      user_id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      status: user.status
    }
  }

  /**
   * @author Parshwa Shah
   * @description Get user information if exists
   */
  async findUser(fieldName: string, value: string, attributes: Array<string>) {
    try {
      const user = await this.userModel.findOne({
        attributes, where: { [fieldName]: value }
      });
      if (!user) throw this.config.MESSAGES.USER_NOT_EXIST;
      return user;
    } catch (error) {
      logger.error('findUser Catch: ', error);
      throw throwAnError(error);
    }
  }

  /**
   * @author Parshwa Shah
   * @description Register user into the system
   */
  async userSignup(data: SignupUser) {
    try {
      const checkUser = await this.userModel.findOne({
        attributes: ['email'], where: { email: data.email }
      });
      if (checkUser) throw this.config.MESSAGES.EMAIL_ALREADY_EXISTS;

      data.password = await this.commonService.hashPassword(data.password);
      const user = await this.userModel.create({ ...data, status: 1 });

      const payload: any = this.createPayload(user);
      const token = await this.createToken(payload);
      payload.token = token;
      return sendSuccessResponse(StatusCodes.OK, true, payload);
    } catch (error) {
      logger.error('userSignup Catch: ', error);
      throw throwAnError(error);
    }
  }

  /**
   * @author Parshwa Shah
   * @description Login user into the system
   */
  async userLogin(data: LoginUser, deviceId: string) {
    try {
      const exclude = ['created_at', 'updated_at', 'deleted_at'];
      const user = await this.userModel.findOne({
        paranoid: false, attributes: { exclude }, where: { email: data.email }
      });

      if (!user || (user && user.deleted_at)) throw this.config.MESSAGES.USER_NOT_EXIST;
      if (user && !user.status) throw this.config.MESSAGES.USER_INACTIVE;

      const isPwdCorrect = await this.commonService.validateHash(
        data.password, user.password
      );
      if (!isPwdCorrect) throw this.config.MESSAGES.USER_NOT_EXIST;

      const payload: any = this.createPayload(user);
      payload.deviceId = deviceId;
      const token = await this.createToken(payload);
      payload.token = token;
      return sendSuccessResponse(StatusCodes.OK, true, payload);
    } catch (error) {
      logger.error('userLogin Catch: ', error);
      throw throwAnError(error);
    }
  }

}