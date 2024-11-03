import { MigrationInterface, QueryRunner } from "typeorm";

export class DbInitModels1730592415696 implements MigrationInterface {
    name = 'DbInitModels1730592415696'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "files" ("id" SERIAL NOT NULL, "url" text NOT NULL, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "locations" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "url" character varying, "address" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "file_id" integer, CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."events_status_enum" AS ENUM('waiting', 'started', 'finished')`);
        await queryRunner.query(`CREATE TABLE "events" ("id" SERIAL NOT NULL, "name" character varying, "date_time" TIMESTAMP NOT NULL, "price" character varying, "status" "public"."events_status_enum" NOT NULL DEFAULT 'waiting', "participants_limit" integer, "link_to_table" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "location_id" integer, "file_id" integer, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "leagues" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_2275e1e3e32e9223298c3a0b514" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_user_league" ("id" SERIAL NOT NULL, "event_id" integer NOT NULL, "user_id" integer NOT NULL, "league_id" integer NOT NULL, CONSTRAINT "UQ_87dbc8e4fcfbb6126113c3fed1e" UNIQUE ("event_id", "user_id", "league_id"), CONSTRAINT "PK_daa5e465cdb8eb574ea3cfc299c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_roles_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "roles" "public"."users_roles_enum" array NOT NULL DEFAULT '{user}', "wins" integer NOT NULL DEFAULT '0', "losses" integer NOT NULL DEFAULT '0', "draws" integer NOT NULL DEFAULT '0', "total" integer NOT NULL DEFAULT '0', "win_rate" double precision NOT NULL DEFAULT '0', "rating" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "file_id" integer, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "locations" ADD CONSTRAINT "FK_700e411e1f6f1395d5283b64b46" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_fccf31c64ec14a66276e9999730" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_a9d65d9417390e6bf1a7695a36b" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_user_league" ADD CONSTRAINT "FK_709cba3d15f4ce547b3c17215a6" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_user_league" ADD CONSTRAINT "FK_9d6145b234e60f175ea95a148ef" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_user_league" ADD CONSTRAINT "FK_dbd2e2c562bb8a07dabbeb8f955" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a367444399d0404c15d7dffdb02" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a367444399d0404c15d7dffdb02"`);
        await queryRunner.query(`ALTER TABLE "event_user_league" DROP CONSTRAINT "FK_dbd2e2c562bb8a07dabbeb8f955"`);
        await queryRunner.query(`ALTER TABLE "event_user_league" DROP CONSTRAINT "FK_9d6145b234e60f175ea95a148ef"`);
        await queryRunner.query(`ALTER TABLE "event_user_league" DROP CONSTRAINT "FK_709cba3d15f4ce547b3c17215a6"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_a9d65d9417390e6bf1a7695a36b"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_fccf31c64ec14a66276e9999730"`);
        await queryRunner.query(`ALTER TABLE "locations" DROP CONSTRAINT "FK_700e411e1f6f1395d5283b64b46"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_roles_enum"`);
        await queryRunner.query(`DROP TABLE "event_user_league"`);
        await queryRunner.query(`DROP TABLE "leagues"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TYPE "public"."events_status_enum"`);
        await queryRunner.query(`DROP TABLE "locations"`);
        await queryRunner.query(`DROP TABLE "files"`);
    }

}
