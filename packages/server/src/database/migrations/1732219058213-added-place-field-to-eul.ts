import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedPlaceFieldToEul1732219058213 implements MigrationInterface {
  name = "AddedPlaceFieldToEul1732219058213";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_user_league" ADD "place" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_user_league" DROP COLUMN "place"`,
    );
  }
}
