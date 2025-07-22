import { MigrationInterface, QueryRunner } from "typeorm";

export class Feedback8696qkejf1749850062676 implements MigrationInterface {
  name = "Feedback8696qkejf1749850062676";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "feedbacks" ("id" SERIAL NOT NULL, "message" text NOT NULL, CONSTRAINT "PK_79affc530fdd838a9f1e0cc30be" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "feedbacks"`);
  }
}
