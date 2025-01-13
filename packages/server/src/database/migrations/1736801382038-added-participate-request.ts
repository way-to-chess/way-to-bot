import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedParticipateRequest1736801382038
  implements MigrationInterface
{
  name = "AddedParticipateRequest1736801382038";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "participate_requests" ("id" SERIAL NOT NULL, "approved" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "event_id" integer NOT NULL, "user_id" integer NOT NULL, "file_id" integer, CONSTRAINT "UQ_d380151219481399223deeed65a" UNIQUE ("event_id", "user_id"), CONSTRAINT "PK_f23150795a67acae444a4fa378a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "participate_requests" ADD CONSTRAINT "FK_2e4ecfa0c374b6f44166b5ad790" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "participate_requests" ADD CONSTRAINT "FK_d40a1dc8721a3c7fdbac704562e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "participate_requests" ADD CONSTRAINT "FK_ee01c4edcf1fcb7bc452bf6ad3f" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "participate_requests" DROP CONSTRAINT "FK_ee01c4edcf1fcb7bc452bf6ad3f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "participate_requests" DROP CONSTRAINT "FK_d40a1dc8721a3c7fdbac704562e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "participate_requests" DROP CONSTRAINT "FK_2e4ecfa0c374b6f44166b5ad790"`,
    );
    await queryRunner.query(`DROP TABLE "participate_requests"`);
  }
}
