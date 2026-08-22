import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCategory1783565882602 implements MigrationInterface {
    name = "CreateCategory1783565882602";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "CATEGORY" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "description" character varying,
                CONSTRAINT "UQ_CATEGORY_name" UNIQUE ("name"),
                CONSTRAINT "PK_CATEGORY_id" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "CATEGORY"`);
    }
}
