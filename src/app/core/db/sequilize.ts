import { Container } from 'typedi';
import { Sequelize } from 'sequelize-typescript';
import { Config } from '../config';
import { logger } from '../logger';

const config = Container.get(Config);
const sequelize = new Sequelize(config.sequelizeConfig);

/**
 * @author Parshwa Shah
 * @description Initialization of the database
 */
async function initializeDb(this: any): Promise<boolean> {
    try {
        await sequelize.authenticate();
        logger.info("MySQL: Database initialized");
    } catch (ex) {
        logger.error("MySQL: ERROR initializing database");
        logger.error(ex);
        process.exit(1);
    }
    return true;
}

/**
 * @author Parshwa Shah
 * @description Create or Alter database
 */
async function createOrAlterDb(): Promise<boolean> {
    try {
        if (config.get('DB_SYNCHRONIZE') === 'true') await sequelize.sync({ alter: true });
        else await sequelize.sync();
        logger.info("DB: Database Created/Altered");
    } catch (ex) {
        logger.error("DB: ERROR creating/altering database");
        logger.error(ex);
        process.exit(1);
    }
    return true;
}

export { sequelize, initializeDb, createOrAlterDb }