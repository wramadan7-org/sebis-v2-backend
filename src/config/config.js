const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../../.env') });

// load database configuration from config.json instead of .env file
const { NODE_ENV } = process.env;
const dbConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json')));
Object.assign(process.env, {
  DB_DIALECT: dbConfig[NODE_ENV].dialect,
  DB_HOST: dbConfig[NODE_ENV].host,
  DB_PORT: dbConfig[NODE_ENV].port,
  DB_NAME: dbConfig[NODE_ENV].database,
  DB_USER: dbConfig[NODE_ENV].username,
  DB_PASSWORD: dbConfig[NODE_ENV].password,
});

// validate configuration
const envVarsSchema = Joi.object().keys({
  NODE_ENV: Joi.string().valid('production', 'development', 'test').required().description('Node app environment'),
  PORT: Joi.number().default(3000).description('Node app listen port'),
  JWT_SECRET: Joi.string().required().description('JWT secret key'),
  DB_DIALECT: Joi.string().default('mysql').description('Database dialect'),
  DB_HOST: Joi.string().default('localhost').description('Database host'),
  DB_PORT: Joi.number().default(3306).description('Database port'),
  DB_NAME: Joi.string().required().description('Database name'),
  DB_USER: Joi.string().required().description('Database user'),
  DB_PASSWORD: Joi.string().required().description('Database password'),
}).unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

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
};