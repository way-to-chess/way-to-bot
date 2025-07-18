import { MigrationInterface, QueryRunner } from "typeorm";

export class EventLeagueResults1747251897280 implements MigrationInterface {
  name = "EventLeagueResults1747251897280";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "event_league_results" ("id" SERIAL NOT NULL, "event_league_id" integer NOT NULL, "rounds_file_id" integer, "rating_file_id" integer, CONSTRAINT "UQ_4cf7091a973180d1594f3217a93" UNIQUE ("event_league_id"), CONSTRAINT "REL_4cf7091a973180d1594f3217a9" UNIQUE ("event_league_id"), CONSTRAINT "REL_9645500aef3ceb369e3488476e" UNIQUE ("rounds_file_id"), CONSTRAINT "REL_00f003b80916d4bac733be52f3" UNIQUE ("rating_file_id"), CONSTRAINT "PK_3662f29a7633eff425a2fe7223d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_league_results" ADD CONSTRAINT "FK_4cf7091a973180d1594f3217a93" FOREIGN KEY ("event_league_id") REFERENCES "events_leagues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_league_results" ADD CONSTRAINT "FK_9645500aef3ceb369e3488476ed" FOREIGN KEY ("rounds_file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_league_results" ADD CONSTRAINT "FK_00f003b80916d4bac733be52f3a" FOREIGN KEY ("rating_file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_league_results" DROP CONSTRAINT "FK_00f003b80916d4bac733be52f3a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_league_results" DROP CONSTRAINT "FK_9645500aef3ceb369e3488476ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_league_results" DROP CONSTRAINT "FK_4cf7091a973180d1594f3217a93"`,
    );
    await queryRunner.query(`DROP TABLE "event_league_results"`);
  }
}
