import { MigrationInterface, QueryRunner } from "typeorm";

export class UserPhone869a0fd8g1754085192099 implements MigrationInterface {
    name = 'UserPhone869a0fd8g1754085192099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phone_number" character varying(32)`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "contact_info"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone_number"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "contact_info" jsonb NOT NULL DEFAULT '{}'`);
    }

}
