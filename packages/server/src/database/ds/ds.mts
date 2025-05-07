import { DataSource, DataSourceOptions } from "typeorm";
import "reflect-metadata";
import "dotenv/config";

const dbOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: true,
  migrations: [process.env.DB_MIGRATIONS_PATH!],
  entities: [process.env.DB_ENTITIES_PATH!],
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
};

export default new DataSource(dbOptions);
