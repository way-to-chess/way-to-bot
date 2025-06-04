import { inject, injectable } from "inversify";
import { FindManyOptions, FindOneOptions, QueryRunner } from "typeorm";
import { DbService } from "@way-to-bot/server/services/db.service.mjs";
import { FileEntity } from "@way-to-bot/server/database/entities/file.entity.mjs";
import { NotFoundError } from "@way-to-bot/server/common/errors/not-found.error.mjs";

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

  getMany(options?: FindManyOptions<FileEntity>, queryRunner?: QueryRunner) {
    return this.getRepository(queryRunner).find(options);
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
