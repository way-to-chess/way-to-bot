import { DataSource, DataSourceOptions } from "typeorm";

const dbOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: true,
  entities: [process.env.DB_ENTITIES_PATH!],
  migrations: [process.env.DB_MIGRATIONS_PATH!],
};

export const dbInstance = new DataSource(dbOptions);
