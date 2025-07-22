import { MigrationInterface, QueryRunner } from "typeorm";

export class UserFields8699azaaj1749480703745 implements MigrationInterface {
  name = "UserFields8699azaaj1749480703745";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM users WHERE length("firstName") > 50 OR length("lastName") > 50 OR length(email) > 255 OR length(username) > 64`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_6f640d8cd261d169b5a5eb25fb0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "username" TYPE character varying(64)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "firstName" TYPE character varying(50)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "lastName" TYPE character varying(50)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
