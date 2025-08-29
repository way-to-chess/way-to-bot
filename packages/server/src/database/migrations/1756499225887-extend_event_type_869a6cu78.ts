import { MigrationInterface, QueryRunner } from "typeorm";

export class ExtendEventType869a6cu781756499225887 implements MigrationInterface {
    name = 'ExtendEventType869a6cu781756499225887'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."events_status_enum" RENAME TO "events_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."events_status_enum" AS ENUM('waiting', 'started', 'finished', 'cancelled', 'registration_closed')`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "status" TYPE "public"."events_status_enum" USING "status"::"text"::"public"."events_status_enum"`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "status" SET DEFAULT 'waiting'`);
        await queryRunner.query(`DROP TYPE "public"."events_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."events_status_enum_old" AS ENUM('waiting', 'started', 'finished')`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "status" TYPE "public"."events_status_enum_old" USING "status"::"text"::"public"."events_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "status" SET DEFAULT 'waiting'`);
        await queryRunner.query(`DROP TYPE "public"."events_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."events_status_enum_old" RENAME TO "events_status_enum"`);
    }

}
