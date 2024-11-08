import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedIndexesToUsers1731061181243 implements MigrationInterface {
  name = "AddedIndexesToUsers1731061181243";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_6f640d8cd261d169b5a5eb25fb0" UNIQUE ("username", "firstName", "lastName")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_6f640d8cd261d169b5a5eb25fb0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`,
    );
  }
}
