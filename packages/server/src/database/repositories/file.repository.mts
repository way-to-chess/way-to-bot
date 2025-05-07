import { inject, injectable } from "inversify";
import { QueryRunner, Repository } from "typeorm";
import { DbService } from '@way-to-bot/server/services/db.service.mjs';
import { FileEntity } from '@way-to-bot/server/database/entities/file.entity.mjs';
import { NotFoundError } from '@way-to-bot/server/common/errors/not-found.error.mjs';

@injectable()
export class FileRepository {
  constructor(@inject(DbService) private readonly _dbService: DbService) {}

  getRepository(queryRunner?: QueryRunner) {
    if (queryRunner) {
      return queryRunner.manager.getRepository(FileEntity);
    }
    return this._dbService.dataSource.getRepository(FileEntity);
  }

  getOneById(id: number, queryRunner?: QueryRunner) {
    return this.getRepository(queryRunner).findOne({ where: { id } });
  }

  getAll(queryRunner?: QueryRunner) {
    return this.getRepository(queryRunner).find();
  }

  async create(payload: Pick<FileEntity, "url">, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const newFile = repo.create(payload);
    const savedFile = await repo.save(newFile);
    return this.getOneById(savedFile.id, queryRunner);
  }

  async delete(id: number, queryRunner?: QueryRunner) {
    const repo = this.getRepository(queryRunner);
    const existingFile = await this.getOneById(id);

    if (!existingFile) {
      throw new NotFoundError(`File with id ${id} not found`);
    }

    const result = await repo.delete(id);
    return result.affected === 1;
  }
}
