import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDbModels1730413308847 implements MigrationInterface {
  name = "InitDbModels1730413308847";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "files" ("id" SERIAL NOT NULL, "url" text NOT NULL, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "locations" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "url" character varying, "address" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "file_id" integer, CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."events_status_enum" AS ENUM('waiting', 'started', 'finished')`,
    );
    await queryRunner.query(
      `CREATE TABLE "events" ("id" SERIAL NOT NULL, "name" character varying, "date_time" TIMESTAMP NOT NULL, "price" character varying, "status" "public"."events_status_enum" NOT NULL DEFAULT 'waiting', "participants_limit" integer, "link_to_table" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "location_id" integer, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_roles_enum" AS ENUM('admin', 'user')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "roles" "public"."users_roles_enum" array NOT NULL DEFAULT '{user}', "wins" integer NOT NULL DEFAULT '0', "losses" integer NOT NULL DEFAULT '0', "draws" integer NOT NULL DEFAULT '0', "total" integer NOT NULL DEFAULT '0', "win_rate" double precision NOT NULL DEFAULT '0', "rating" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "file_id" integer, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "events_users" ("event_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_f3bea340f13558177a594fff0af" PRIMARY KEY ("event_id", "user_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6bce6dc80ee8e9f5a960e96eb3" ON "events_users" ("event_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_df93e44b48c1545c0795a11543" ON "events_users" ("user_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "locations" ADD CONSTRAINT "FK_700e411e1f6f1395d5283b64b46" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_fccf31c64ec14a66276e9999730" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_a367444399d0404c15d7dffdb02" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_users" ADD CONSTRAINT "FK_6bce6dc80ee8e9f5a960e96eb35" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_users" ADD CONSTRAINT "FK_df93e44b48c1545c0795a115435" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events_users" DROP CONSTRAINT "FK_df93e44b48c1545c0795a115435"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_users" DROP CONSTRAINT "FK_6bce6dc80ee8e9f5a960e96eb35"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_a367444399d0404c15d7dffdb02"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_fccf31c64ec14a66276e9999730"`,
    );
    await queryRunner.query(
      `ALTER TABLE "locations" DROP CONSTRAINT "FK_700e411e1f6f1395d5283b64b46"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_df93e44b48c1545c0795a11543"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6bce6dc80ee8e9f5a960e96eb3"`,
    );
    await queryRunner.query(`DROP TABLE "events_users"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_roles_enum"`);
    await queryRunner.query(`DROP TABLE "events"`);
    await queryRunner.query(`DROP TYPE "public"."events_status_enum"`);
    await queryRunner.query(`DROP TABLE "locations"`);
    await queryRunner.query(`DROP TABLE "files"`);
  }
}
