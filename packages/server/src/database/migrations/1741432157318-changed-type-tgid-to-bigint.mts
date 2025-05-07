import { IsNull, MigrationInterface, Not, QueryRunner } from "typeorm";
import { UserEntity } from "@way-to-bot/server/database/entities/user.entity.mjs";

export class ChangedTypeTgidToBigint1741432157318
  implements MigrationInterface
{
  name = "ChangedTypeTgidToBigint1741432157318";

  public async up(queryRunner: QueryRunner): Promise<void> {
    const userRepository = queryRunner.manager.getRepository(UserEntity);
    const users = await userRepository.find({
      where: {
        tgId: Not(IsNull()),
      },
    });
    users.forEach((u) => {
      u.tgId = String(u.tgId);
    });

    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_9793d2defd72fffdb9a55c0d88f"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tg_id"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "tg_id" bigint`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_9793d2defd72fffdb9a55c0d88f" UNIQUE ("tg_id")`,
    );

    await userRepository.save(users);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_9793d2defd72fffdb9a55c0d88f"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tg_id"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "tg_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_9793d2defd72fffdb9a55c0d88f" UNIQUE ("tg_id")`,
    );
  }
}
