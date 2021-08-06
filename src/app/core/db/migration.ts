import { logger } from '../logger';
import { sequelize, createOrAlterDb } from './sequilize';

(async function migration() {
    try {
        logger.info('------------------------Migration started---------------------');
        await createOrAlterDb();
        await sequelize.close();
        logger.info('------------------------Migration ended---------------------');
    } catch (error) {
        logger.error('---------------------------Error:');
        logger.error(error);
    }
})();