import { DataSource } from "typeorm";
import { injectable } from "inversify";
import { dbConnectionOptions } from "@way-to-bot/server/utils/constants.mjs";

@injectable()
export class DbService {
  private readonly _dataSource: DataSource;

  constructor() {
    this._dataSource = new DataSource(dbConnectionOptions);
  }

  get dataSource() {
    return this._dataSource;
  }

  async init() {
    return this.dataSource.initialize();
  }
}
