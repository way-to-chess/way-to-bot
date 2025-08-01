import { DataSourceOptions } from "typeorm";
import { EventEntitySubscriber } from "@way-to-bot/server/database/subscribers/event.subscriber";
import { LeagueEntity } from "@way-to-bot/server/database/entities/league.entity";
import { LocationEntity } from "@way-to-bot/server/database/entities/location.entity";
import { FileEntity } from "@way-to-bot/server/database/entities/file.entity";
import { UserEntity } from "@way-to-bot/server/database/entities/user.entity";
import { EventEntity } from "@way-to-bot/server/database/entities/event.entity";
import { ParticipateRequestEntity } from "@way-to-bot/server/database/entities/participate-request.entity";
import { EventLeagueEntity } from "@way-to-bot/server/database/entities/event-league.entity";
import { EventLeagueUserEntity } from "@way-to-bot/server/database/entities/event-league-user.entity";
import { EventLeagueResultEntity } from "@way-to-bot/server/database/entities/event-league-result.entity";
import { FeedbackEntity } from "@way-to-bot/server/database/entities/feedback.entity";

export const DEFAULT_LEAGUE_NAME = "DEFAULT";

// env
export const NODE_ENV = process.env.NODE_ENV;

// POSTGRES
export const DB_HOST = process.env.DB_HOST!;
export const DB_PORT = process.env.DB_PORT!;
export const POSTGRES_USER = process.env.POSTGRES_USER!;
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD!;
export const POSTGRES_DB = process.env.POSTGRES_DB!;
export const dbConnectionOptions: DataSourceOptions = {
  type: "postgres",
  host: DB_HOST,
  port: Number(DB_PORT),
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  synchronize: false,
  logging: NODE_ENV === "production" ? false : ["query", "error", "schema", "warn", "info", "log"],
  entities: [
    LocationEntity,
    LeagueEntity,
    FileEntity,
    UserEntity,
    EventEntity,
    ParticipateRequestEntity,
    EventLeagueEntity,
    EventLeagueUserEntity,
    EventLeagueResultEntity,
    FeedbackEntity,
  ],
  subscribers: [EventEntitySubscriber],
  ssl: NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
};

// TG
export const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN!;
export const WEB_URL = process.env.WEB_URL!;

// PATHS
export const PATH_TO_PROJECT_FOLDER = process.env.PATH_TO_PROJECT_FOLDER!;
export const PATH_TO_LOGS = process.env.PATH_TO_LOGS!;
export const PATH_TO_UPLOADS = process.env.PATH_TO_UPLOADS!;

// JWT
export const JWT_SECRET = process.env.JWT_SECRET!;
