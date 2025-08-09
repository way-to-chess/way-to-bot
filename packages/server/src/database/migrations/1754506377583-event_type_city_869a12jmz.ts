import { MigrationInterface, QueryRunner } from "typeorm";

export class EventTypeCity869a12jmz1754506377583 implements MigrationInterface {
    name = 'EventTypeCity869a12jmz1754506377583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."events_type_enum" AS ENUM('chess', 'festival', 'other')`);
        await queryRunner.query(`ALTER TABLE "events" ADD "type" "public"."events_type_enum" NOT NULL DEFAULT 'other'`);
        await queryRunner.query(`ALTER TABLE "events" ADD "city" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."events_type_enum"`);
    }

}
