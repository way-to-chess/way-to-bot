import { MigrationInterface, QueryRunner } from "typeorm";

export class EventTypeCity869a12jmz1754506377583 implements MigrationInterface {
  name = "EventTypeCity869a12jmz1754506377583";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typname = 'events_type_enum'
      AND n.nspname = 'public'
  ) THEN
    CREATE TYPE public.events_type_enum AS ENUM ('chess', 'festival', 'other');
  END IF;
END
$$;`);
    await queryRunner.query(
      `ALTER TABLE "events" ADD IF NOT EXISTS "type" "public"."events_type_enum" NOT NULL DEFAULT 'other'`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD IF NOT EXISTS "city" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "city"`);
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "type"`);
    await queryRunner.query(`DROP TYPE "public"."events_type_enum"`);
  }
}
