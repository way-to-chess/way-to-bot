import { MigrationInterface, QueryRunner } from "typeorm";

export class Pr8699d1pt51749932179008 implements MigrationInterface {
  name = "Pr8699d1pt51749932179008";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "participate_requests" DROP COLUMN "approved"`,
    );
    await queryRunner.query(
      `ALTER TABLE "participate_requests" DROP COLUMN "additionalUsers"`,
    );
    await queryRunner.query(
      `ALTER TABLE "participate_requests" ADD "additional_users" jsonb NOT NULL DEFAULT '[]'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."participate_requests_status_enum" AS ENUM('waiting', 'approved', 'rejected')`,
    );
    await queryRunner.query(
      `ALTER TABLE "participate_requests" ADD "status" "public"."participate_requests_status_enum" NOT NULL DEFAULT 'waiting'`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."participate_requests_payment_type_enum" AS ENUM('cash', 'online', 'receipt')`,
    );
    await queryRunner.query(
      `ALTER TABLE "participate_requests" ADD "payment_type" "public"."participate_requests_payment_type_enum" NOT NULL DEFAULT 'cash'`,
    );
    await queryRunner.query(
      `ALTER TABLE "participate_requests" ADD "message" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "lastName" TO "last_name"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "firstName" TO "first_name"`,
    );
    await queryRunner.query(
      `UPDATE participate_requests SET status = 'approved'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "last_name" TO "lastName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" RENAME COLUMN "first_name" TO "firstName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "participate_requests" DROP COLUMN "message"`,
    );
    await queryRunner.query(
      `ALTER TABLE "participate_requests" DROP COLUMN "payment_type"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."participate_requests_payment_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "participate_requests" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."participate_requests_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "participate_requests" DROP COLUMN "additional_users"`,
    );
    await queryRunner.query(
      `ALTER TABLE "participate_requests" ADD "additionalUsers" jsonb NOT NULL DEFAULT '[]'`,
    );
    await queryRunner.query(
      `ALTER TABLE "participate_requests" ADD "approved" boolean NOT NULL`,
    );
  }
}
