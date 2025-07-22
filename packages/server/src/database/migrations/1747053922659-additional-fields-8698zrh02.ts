import { MigrationInterface, QueryRunner } from "typeorm";

export class AdditionalFields8698zrh021747053922659
  implements MigrationInterface
{
  name = "AdditionalFields8698zrh021747053922659";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."locations_benefits_enum" AS ENUM('food', 'drinks', 'alcohol', 'photo', 'video', 'wc')`,
    );
    await queryRunner.query(
      `ALTER TABLE "locations" ADD "benefits" "public"."locations_benefits_enum" array NOT NULL DEFAULT '{}'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "contact_info" jsonb NOT NULL DEFAULT '[]'`,
    );
    await queryRunner.query(`ALTER TABLE "events" ADD "duration" integer`);
    await queryRunner.query(
      `ALTER TABLE "events" ADD "description" character varying`,
    );
    await queryRunner.query(
      `
        ALTER TABLE events ADD COLUMN host_id INTEGER;
        UPDATE events SET host_id = 39 WHERE host_id IS NULL;
        ALTER TABLE events ALTER COLUMN host_id SET NOT NULL;
      `,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_a612b523901cc5dd938ff3bdb03" FOREIGN KEY ("host_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_a612b523901cc5dd938ff3bdb03"`,
    );
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "host_id"`);
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "duration"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "contact_info"`);
    await queryRunner.query(`ALTER TABLE "locations" DROP COLUMN "benefits"`);
    await queryRunner.query(`DROP TYPE "public"."locations_benefits_enum"`);
  }
}
