// Libraries
const cron = require('node-cron');
import { Op } from "sequelize";
import * as moment from 'moment';
import { Service } from 'typedi';

// Services
import { sequelize } from '../../core/db/sequilize';

// Utils
import { logger } from '../logger';

@Service()
export class CronService {

  circleModel = sequelize.models.Circle;

  constructor(
  ) { }

  runCrons() {
    cron.schedule('1 0 * * *', () => {
      logger.info('Cron: Daily at 00:01 (night)');
      this.expireCircle();
    });
  }

  /**
   * @author Parshwa Shah
   * @description Expire circle based on deadline
   */
  async expireCircle() {
    try {
      await this.circleModel.update({ status: 3 }, {
        where: { status: 2, circle_deadline: { [Op.lt]: moment() } }
      });
    } catch (error) {
      logger.error('closeJobPosts Catch: ', error);
    }
  }

}