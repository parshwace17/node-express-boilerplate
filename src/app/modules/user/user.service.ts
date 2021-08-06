import { Service } from 'typedi';
import { StatusCodes } from 'http-status-codes';

// Services
import { Config } from '../../core/config';
import { sequelize } from '../../core/db/sequilize';
import { CommonService } from '../../core/services/common.service';

// Utils
import { logger } from '../../core/logger';
import { ChangePassword } from './helpers/users.interface';
import { sendSuccessResponse, throwAnError } from '../../core/helper/response-handler';

@Service()
export class UserService {

  userModel = sequelize.models.User;

  constructor(
    private readonly config: Config,
    private readonly commonService: CommonService,
  ) { }

  /**
   * @author Jainam Shah
   * @description Get user information if exists
   */
  async findUser(fieldName: string, value: string | number, attributes: Array<string>) {
    try {
      const user = await this.userModel.findOne({
        attributes, where: { [fieldName]: value }
      });
      if (!user) throw this.config.MESSAGES.USER_NOT_FOUND;
      return user;
    } catch (error) {
      logger.error('findUser Catch: ', error);
      throw throwAnError(error);
    }
  }

  /**
   * @author Jainam Shah
   * @description Get logged in user's information
   */
  async getUser(id: number) {
    try {
      const exclude = ['role', 'status', 'password', 'created_at', 'updated_at', 'deleted_at']
      const user = await this.userModel.findOne({ attributes: { exclude }, where: { id } });
      if (!user) throw this.config.MESSAGES.USER_NOT_FOUND;
      return sendSuccessResponse(StatusCodes.OK, true, user);
    } catch (error) {
      logger.error('getUser Catch: ', error);
      throw throwAnError(error);
    }
  }

  /**
   * @author Jainam Shah
   * @description Change logged in user's password
   */
  async changePassword(user_id: number, data: ChangePassword) {
    try {
      const user = await this.findUser('id', user_id, ['id', 'password']);

      const result = await this.commonService.validateHash(data.old_password, user.password);
      if (!result) throw this.config.MESSAGES.INCORRECT_OLD_PASSWORD;

      const password = await this.commonService.hashPassword(data.password);
      await this.userModel.update({ password }, { where: { id: user.id } });

      const { message, status } = this.config.MESSAGES.PWD_UPDATED;
      return sendSuccessResponse(status, true, null, message);
    } catch (error) {
      logger.error('changePassword Catch: ', error);
      throw throwAnError(error);
    }
  }

}
