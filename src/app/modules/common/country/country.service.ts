// Libraries
import { Service } from 'typedi';
import { StatusCodes } from 'http-status-codes';

// Services, Instance (Sequelize)
import { sequelize } from '../../../core/db/sequilize';

// Utils
import { logger } from '../../../core/logger';
import { sendSuccessResponse as success, throwAnError } from '../../../core/helper/response-handler';

@Service()
export class CountryService {
  stateModel = sequelize.models.States;
  countryModel = sequelize.models.Countries;

  constructor() { }

  /**
   * @author Jainam Shah
   * @description Get Countries List
   * @returns countries
   */
  async getCountries() {
    try {
      const data = await this.countryModel.findAll({
        attributes: ['id', 'name', 'phone_code', 'emoji']
      });
      return success(StatusCodes.OK, true, { data });
    } catch (error) {
      logger.error('getCountries Catch: ', error);
      throw throwAnError(error);
    }
  }

  /**
   * @author Jainam Shah
   * @description Get States List
   * @param country_id
   */
  async getStatesByCountry(country_id: number) {
    try {
      const data = await this.stateModel.findAll({
        attributes: ['id', 'name'],
        where: { country_id },
        order: [['name', 'ASC']]
      });
      return success(StatusCodes.OK, true, data);
    } catch (error) {
      logger.error('getStatesByCountry Catch: ', error);
      throw throwAnError(error);
    }
  }

}
