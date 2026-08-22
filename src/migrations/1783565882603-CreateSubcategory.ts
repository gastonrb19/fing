import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSubcategory1783565882603 implements MigrationInterface {
    name = "CreateSubcategory1783565882603";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "SUBCATEGORY" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "description" character varying,
                "categoryId" integer NOT NULL,
                CONSTRAINT "UQ_SUBCATEGORY_name" UNIQUE ("name"),
                CONSTRAINT "PK_SUBCATEGORY_id" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "SUBCATEGORY"
            ADD CONSTRAINT "FK_SUBCATEGORY_categoryId"
            FOREIGN KEY ("categoryId") REFERENCES "CATEGORY"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "SUBCATEGORY" DROP CONSTRAINT "FK_SUBCATEGORY_categoryId"`);
        await queryRunner.query(`DROP TABLE "SUBCATEGORY"`);
    }
}
