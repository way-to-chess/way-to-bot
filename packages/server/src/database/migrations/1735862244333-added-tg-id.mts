import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedTgId1735862244333 implements MigrationInterface {
  name = "AddedTgId1735862244333";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "tg_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_9793d2defd72fffdb9a55c0d88f" UNIQUE ("tg_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_6f640d8cd261d169b5a5eb25fb0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "username" DROP NOT NULL`,
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
      `ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_6f640d8cd261d169b5a5eb25fb0" UNIQUE ("username", "firstName", "lastName")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_9793d2defd72fffdb9a55c0d88f"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tg_id"`);
  }
}
