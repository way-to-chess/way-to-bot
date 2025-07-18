import { MigrationInterface, QueryRunner } from "typeorm";

export class Rm8699cqxqj1750515662426 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS event_league;`);
    await queryRunner.query(`DROP TABLE IF EXISTS event_user_league;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
