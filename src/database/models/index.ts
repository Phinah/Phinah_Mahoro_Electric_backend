import 'dotenv/config';
import { Sequelize } from 'sequelize';

const env = process.env.NODE_ENV || 'development';

const config = require(__dirname + '/../config/config.js')[env];

const db: Sequelize = new Sequelize(
    process.env[config.use_env_variable] as string,
    config,
  )
;

export default db;
