import { DataSource, DataSourceOptions } from "typeorm";
import * as process from "node:process";

const dbOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: true,
  entities: ["../../../shared/src/entities/*.ts"],
  migrations: [process.env.DB_MIGRATIONS_PATH!],
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
};

export const dbInstance = new DataSource(dbOptions);
