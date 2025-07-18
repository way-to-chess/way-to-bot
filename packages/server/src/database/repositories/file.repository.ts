import { inject, injectable } from "inversify";
import { FindOneOptions, QueryRunner } from "typeorm";
import { DbService } from "@way-to-bot/server/services/db.service";
import { FileEntity } from "@way-to-bot/server/database/entities/file.entity";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error";
import { TCommonGetManyOptions } from "@way-to-bot/shared/api/zod/common/get-many-options.schema";
import { GetManyOptionsDTO } from "@way-to-bot/server/DTO/get-many-options.DTO";

@injectable()
export class FileRepository {
  constructor(@inject(DbService) private readonly _dbService: DbService) {}

  getRepository(queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.getRepository(FileEntity);
    }
    return this._dbService.dataSource.getRepository(FileEntity);
  }

  getOne(options: FindOneOptions<FileEntity>, queryRunner?: QueryRunner) {
    return this.getRepository(queryRunner).findOne(options);
  }

  async getMany(options?: TCommonGetManyOptions, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const queryBuilder = repo.createQueryBuilder("file");

    if (options) {
      const manyOptionsDTO = new GetManyOptionsDTO<FileEntity>(options);
      manyOptionsDTO.applyToQueryBuilder(queryBuilder, "file");
    }

    const [data, count] = await queryBuilder.getManyAndCount();

    return {
      data,
      count,
    };
  }

  async create(
    payload: Pick<FileEntity, "url" | "previewUrl">,
    queryRunner?: QueryRunner,
  ) {
    const repo = this.getRepository(queryRunner);
    const newFile = repo.create(payload);
    const savedFile = await repo.save(newFile);
    return this.getOne({ where: { id: savedFile.id } }, queryRunner);
  }

  async delete(id: number, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const existingFile = await this.getOne(
      { where: { id: id }, relations: undefined },
      queryRunner,
    );

    if (!existingFile) {
      throw new NotFoundError(`File with id ${id} not found`);
    }

    const result = await repo.delete(id);
    return result.affected === 1;
  }
}
