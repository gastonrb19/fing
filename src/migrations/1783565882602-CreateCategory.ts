import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCategory1783565882602 implements MigrationInterface {
    name = "CreateCategory1783565882602";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "category_entity" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "description" character varying,
                CONSTRAINT "UQ_category_entity_name" UNIQUE ("name"),
                CONSTRAINT "PK_category_entity_id" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "category_entity"`);
    }
}
