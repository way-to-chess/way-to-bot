import { DataSourceOptions } from "typeorm";

export const dbInstance: DataSourceOptions = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: true,
  entities: [process.env.DB_ENTITIES_PATH],
  migrations: [process.env.DB_MIGRATIONS_PATH],
};
