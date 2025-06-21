import pg from "pg";

export class DbService {
  _pool;

  constructor() {
    this._pool = new pg.Pool({
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.POSTGRES_DB,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
    });
  }

  async connect() {
    if (!this._client) this._client = await this._pool.connect();
  }

  async query(query) {
    console.log("\x1b[90m%s\x1b[0m", query);
    return this._client.query(query);
  }

  async destroy() {
    if (this._client) {
      this._client.release();
      this._client = null;
    }

    if (this._pool) {
      await this._pool.end();
      this._pool = null;
    }
  }
}
