import { MigrationInterface, QueryRunner } from "typeorm";

export class DevideThreeFieldsAssociation1745956548107
  implements MigrationInterface
{
  name = "DevideThreeFieldsAssociation1745956548107";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // new tables
    await queryRunner.query(
      `CREATE TABLE "events_leagues_users" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "event_league_id" integer NOT NULL, "place" integer, "points" integer, CONSTRAINT "UQ_bcdd46758b7f7243f3f64a59229" UNIQUE ("event_league_id", "user_id"), CONSTRAINT "PK_14f5ea3b1759a4c74e6945fdbbe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "events_leagues" ("id" SERIAL NOT NULL, "event_id" integer NOT NULL, "league_id" integer NOT NULL, "link" character varying, CONSTRAINT "UQ_902112974030c515b8a3272d57a" UNIQUE ("event_id", "league_id"), CONSTRAINT "PK_b31c4d786632ef39f0e93871ae7" PRIMARY KEY ("id"))`,
    );

    // Files
    await queryRunner.query(`
  ALTER TABLE "files" ADD "previewUrl" character varying
`);
    await queryRunner.query(`
  ALTER TABLE files
  ALTER COLUMN "url" TYPE character varying,
   ALTER COLUMN "url" SET NOT NULL
`);

    // Locations
    await queryRunner.query(`
  ALTER TABLE "locations"
    ALTER COLUMN "title" TYPE character varying(255),
    ALTER COLUMN "title" SET NOT NULL
`);
    await queryRunner.query(`
  ALTER TABLE "locations"
    ALTER COLUMN "address" TYPE character varying(255)
`);

    // Leagues
    await queryRunner.query(`
  ALTER TABLE "leagues"
    ALTER COLUMN "name" TYPE character varying(64),
    ALTER COLUMN "name" SET NOT NULL
`);



    // Events
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_fccf31c64ec14a66276e9999730"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_a9d65d9417390e6bf1a7695a36b"`,
    );
    await queryRunner.query(`
  ALTER TABLE "events"
    ALTER COLUMN "name" TYPE character varying(128),
    ALTER COLUMN "name" SET NOT NULL
`);
    await queryRunner.query(`
  ALTER TABLE "events"
    ALTER COLUMN "price" TYPE character varying(32)
`);

    // users
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_a367444399d0404c15d7dffdb02"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_6f640d8cd261d169b5a5eb25fb0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`,
    );
    await queryRunner.query(`
  ALTER TABLE "users"
    ALTER COLUMN "username" TYPE character varying(255)
`);
    await queryRunner.query(`
  ALTER TABLE "users"
    ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")
`);
    await queryRunner.query(`
  ALTER TABLE "users"
    ALTER COLUMN "firstName" TYPE character varying(255),
    ALTER COLUMN "firstName" SET NOT NULL
`);
    await queryRunner.query(`
  ALTER TABLE "users"
    ALTER COLUMN "lastName" TYPE character varying(255),
    ALTER COLUMN "lastName" SET NOT NULL
`);

    // Constraints
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_6f640d8cd261d169b5a5eb25fb0" UNIQUE ("username", "firstName", "lastName")`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_leagues_users" ADD CONSTRAINT "FK_f324075478d528c6cfd9df58698" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_leagues_users" ADD CONSTRAINT "FK_60045c48c44dfdc3983f5d860e0" FOREIGN KEY ("event_league_id") REFERENCES "events_leagues"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_leagues" ADD CONSTRAINT "FK_092dd52b695c134c0b62a50aa2e" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_leagues" ADD CONSTRAINT "FK_a4964873c80416253c6d3341558" FOREIGN KEY ("league_id") REFERENCES "leagues"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_fccf31c64ec14a66276e9999730" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_a9d65d9417390e6bf1a7695a36b" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_a367444399d0404c15d7dffdb02" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(`
        INSERT INTO events_leagues (event_id, league_id)
        SELECT DISTINCT event_id, league_id
        FROM event_user_league;

        INSERT INTO events_leagues_users (user_id, event_league_id, place)
        SELECT 
            eul.user_id,
            el.id AS event_league_id,
            eul.place
        FROM event_user_league eul
        JOIN events_leagues el
            ON el.event_id = eul.event_id AND el.league_id = eul.league_id;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_a367444399d0404c15d7dffdb02"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_a9d65d9417390e6bf1a7695a36b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_fccf31c64ec14a66276e9999730"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_leagues" DROP CONSTRAINT "FK_a4964873c80416253c6d3341558"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_leagues" DROP CONSTRAINT "FK_092dd52b695c134c0b62a50aa2e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_leagues_users" DROP CONSTRAINT "FK_60045c48c44dfdc3983f5d860e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events_leagues_users" DROP CONSTRAINT "FK_f324075478d528c6cfd9df58698"`,
    );
    await queryRunner.query(
      `ALTER TABLE "locations" DROP CONSTRAINT "FK_700e411e1f6f1395d5283b64b46"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_6f640d8cd261d169b5a5eb25fb0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "file_id" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastName"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "lastName" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firstName"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "firstName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "username" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_6f640d8cd261d169b5a5eb25fb0" UNIQUE ("username", "firstName", "lastName")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_a367444399d0404c15d7dffdb02" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ALTER COLUMN "file_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ALTER COLUMN "location_id" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "price"`);
    await queryRunner.query(
      `ALTER TABLE "events" ADD "price" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "events" ADD "name" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_a9d65d9417390e6bf1a7695a36b" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_fccf31c64ec14a66276e9999730" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "leagues" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "leagues" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "locations" ALTER COLUMN "file_id" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "locations" DROP COLUMN "address"`);
    await queryRunner.query(
      `ALTER TABLE "locations" ADD "address" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "locations" DROP COLUMN "title"`);
    await queryRunner.query(
      `ALTER TABLE "locations" ADD "title" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "locations" ADD CONSTRAINT "FK_700e411e1f6f1395d5283b64b46" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "url"`);
    await queryRunner.query(`ALTER TABLE "files" ADD "url" text NOT NULL`);
    await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "previewUrl"`);
    await queryRunner.query(`DROP TABLE "events_leagues"`);
    await queryRunner.query(`DROP TABLE "events_leagues_users"`);
  }
}
