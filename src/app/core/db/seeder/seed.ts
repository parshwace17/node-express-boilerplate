/**
 * This is seeding data for DB
 * Used for new Database (Or empty)
 * To fill some master data / static data
 */
import { logger } from '../../logger';
import { sequelize } from '../sequilize';
import { STATIC_VALUES } from './data';
import { Countries } from '../../../models/common/countries.model';
import { States } from '../../../models/common/states.model';

(async function seedDatabase() {
  try {
    await sequelize.sync();

    logger.info('------------------------Seeding started: Countries---------------------');
    const country = sequelize.getRepository(Countries);
    await country.bulkCreate(STATIC_VALUES.countries);
    logger.info('-------------------------Seeding ended: Countries----------------------');


    logger.info('------------------------Seeding started: States---------------------');
    const states = sequelize.getRepository(States);
    await states.bulkCreate(STATIC_VALUES.states);
    logger.info('-------------------------Seeding ended: States----------------------');

    await sequelize.close();
  } catch (error) {
    logger.error('---------------------------Error:');
    logger.error(error);
  }
})();
