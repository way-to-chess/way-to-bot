import { MigrationInterface, QueryRunner } from "typeorm";

export class EventAddInfo8699ky8g01752765595086 implements MigrationInterface {
  name = "EventAddInfo8699ky8g01752765595086";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "events" ADD "additional_info" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events" DROP COLUMN "additional_info"`,
    );
  }
}
