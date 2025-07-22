import { DataSource, DataSourceOptions } from "typeorm";
import "reflect-metadata";
import "dotenv/config";

const PROJECT_ROOT = process.env.PROJECT_ROOT || "src";
const fileExt = PROJECT_ROOT === 'src' ? 'ts' : 'js';

const dbOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: true,
  migrations: [`./${PROJECT_ROOT}/database/migrations/*.${fileExt}`],
  entities: [`./${PROJECT_ROOT}/database/entities/*.${fileExt}`],
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
};

export default new DataSource(dbOptions);
