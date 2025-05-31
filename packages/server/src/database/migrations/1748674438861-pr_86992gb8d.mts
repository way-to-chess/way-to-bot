import { MigrationInterface, QueryRunner } from "typeorm";

export class Pr86992gb8d1748674438861 implements MigrationInterface {
  name = "Pr86992gb8d1748674438861";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "participate_requests" DROP CONSTRAINT "UQ_d380151219481399223deeed65a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "files" RENAME COLUMN "previewUrl" TO "preview_url"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "email" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "birth_date" date`);
    await queryRunner.query(
      `ALTER TABLE "participate_requests" ADD "additionalUsers" jsonb NOT NULL DEFAULT '[]'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "participate_requests" DROP COLUMN "additionalUsers"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "birth_date"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
    await queryRunner.query(
      `ALTER TABLE "files" RENAME COLUMN "preview_url" TO "previewUrl"`,
    );
    await queryRunner.query(
      `ALTER TABLE "participate_requests" ADD CONSTRAINT "UQ_d380151219481399223deeed65a" UNIQUE ("event_id", "user_id")`,
    );
  }
}
