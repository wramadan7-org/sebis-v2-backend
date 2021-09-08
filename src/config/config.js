const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object().keys({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required().description('Node app environment'),
  PORT: Joi.number().default(3000).description('Node app listen port'),
  JWT_SECRET: Joi.string().required().description('JWT secret key'),
  DB_HOST: Joi.string().default('localhost').description('Database host'),
  DB_PORT: Joi.number().default(3306).description('Database port'),
  DB_NAME: Joi.string().required().description('Database name'),
  DB_USER: Joi.string().required().description('Database user'),
  DB_PASSWORD: Joi.string().required().description('Database password'),
}).unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const dbCredentials = {
  production: {
    username: `${envVars.DB_USER}`,
    password: `${envVars.DB_PASSWORD}`,
    database: `${envVars.DB_NAME}`,
    host: `${envVars.DB_HOST}`,
    dialect: "mariadb",
  },
  development: {
    username: `${envVars.DB_USER}`,
    password: `${envVars.DB_PASSWORD}`,
    database: `${envVars.DB_NAME}-development`,
    host: `${envVars.DB_HOST}`,
    dialect: "mariadb",
  },
  test: {
    username: `${envVars.DB_USER}`,
    password: `${envVars.DB_PASSWORD}`,
    database: `${envVars.DB_NAME}-test`,
    host: `${envVars.DB_HOST}`,
    dialect: "mariadb",
  },
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  database: {
    host: envVars.DB_HOST,
    port: envVars.DB_PORT,
    db: envVars.DB_NAME,
    user: envVars.DB_USER,
    password: envVars.DB_PASSWORD,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
  },
  dbCredentials,
};