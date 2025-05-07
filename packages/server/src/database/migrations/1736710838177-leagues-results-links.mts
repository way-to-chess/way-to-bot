import { MigrationInterface, QueryRunner } from "typeorm";

export class LeaguesResultsLinks1736710838177 implements MigrationInterface {
  name = "LeaguesResultsLinks1736710838177";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events" RENAME COLUMN "link_to_table" TO "link_to_stream"`,
    );
    await queryRunner.query(
      `CREATE TABLE "event_league" ("id" SERIAL NOT NULL, "link" text, "event_id" integer NOT NULL, "league_id" integer NOT NULL, CONSTRAINT "UQ_094ba20d0a8475f22721944341d" UNIQUE ("event_id", "league_id"), CONSTRAINT "PK_65abadb586dee0d6d697ee2b6de" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_league" ADD CONSTRAINT "FK_b05072f6441f9be95c3da779e73" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_league" ADD CONSTRAINT "FK_ab0e059633b509652eb79d18574" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_league" DROP CONSTRAINT "FK_ab0e059633b509652eb79d18574"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_league" DROP CONSTRAINT "FK_b05072f6441f9be95c3da779e73"`,
    );
    await queryRunner.query(`DROP TABLE "event_league"`);
    await queryRunner.query(
      `ALTER TABLE "events" RENAME COLUMN "link_to_stream" TO "link_to_table"`,
    );
  }
}
