import { inject, injectable } from "inversify";
import { DbService } from "@way-to-bot/server/services/db.service";
import { FeedbackEntity } from "@way-to-bot/server/database/entities/feedback.entity";
import { QueryRunner } from "typeorm";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO";

@injectable()
export class FeedbackRepository {
  constructor(@inject(DbService) private readonly _dbService: DbService) {}

  getRepository(queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.getRepository(FeedbackEntity);
    }
    return this._dbService.dataSource.getRepository(FeedbackEntity);
  }

  async create(
    feedback: Pick<FeedbackEntity, "message">,
    queryRunner?: QueryRunner,
  ) {
    const repo = this.getRepository(queryRunner);
    const newFeedback = repo.create(feedback);
    await this.getRepository(queryRunner).save(newFeedback);
    return true;
  }

  async getMany(options?: TCommonGetManyOptions, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const queryBuilder = repo.createQueryBuilder("feedback");

    if (options) {
      const manyOptionsDTO = new GetManyOptionsDTO<FeedbackEntity>(options);
      manyOptionsDTO.applyToQueryBuilder(queryBuilder, "feedback");
    }

    const [data, count] = await queryBuilder.getManyAndCount();

    return {
      data,
      count,
    };
  }
}
