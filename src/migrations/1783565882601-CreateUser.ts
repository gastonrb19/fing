import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUser1783565882601 implements MigrationInterface {
    name = "CreateUser1783565882601";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "USERS" (
                "id" SERIAL NOT NULL,
                "username" character varying NOT NULL,
                "email" character varying NOT NULL,
                "hashedPassword" character varying NOT NULL,
                "phone" character varying,
                CONSTRAINT "UQ_USERS_username" UNIQUE ("username"),
                CONSTRAINT "UQ_USERS_email" UNIQUE ("email"),
                CONSTRAINT "UQ_USERS_phone" UNIQUE ("phone"),
                CONSTRAINT "PK_USERS_id" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "USERS"`);
    }
}
