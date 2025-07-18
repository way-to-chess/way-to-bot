import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultLeague1747139326500 implements MigrationInterface {
  name = "AddDefaultLeague1747139326500";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "leagues" ADD CONSTRAINT "UQ_1aa854560091fd99ebdadddda73" UNIQUE ("name")`,
    );
    await queryRunner.query(`
    INSERT INTO leagues (name)
    VALUES ('DEFAULT')
    ON CONFLICT (name) DO NOTHING;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "leagues" DROP CONSTRAINT "UQ_1aa854560091fd99ebdadddda73"`,
    );
  }
}
