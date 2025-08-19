/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import 'dotenv/config';
import * as joi from 'joi';

interface ENV {
  PORT: number;
  

  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_HOST: string;
  DB_PORT: string;

}


const envVarsSchema = joi.object<ENV>({
  PORT: joi.number().default(3000).port().required(),
  

  DB_USER: joi.string().required(),
  DB_PASSWORD: joi.string().required(),
  DB_NAME: joi.string().required(),
  DB_HOST: joi.string().required(),
  DB_PORT: joi.string().required(),


}).unknown();


const { value, error } = envVarsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}


export const envs = {
  port: value.PORT,
  

  dbUser: value.DB_USER,
  dbPassword: value.DB_PASSWORD,
  dbName: value.DB_NAME,
  dbHost: value.DB_HOST,
  dbPort: value.DB_PORT,
};


