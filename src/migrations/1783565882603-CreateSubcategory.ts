import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSubcategory1783565882603 implements MigrationInterface {
    name = "CreateSubcategory1783565882603";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "subcategory_entity" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "description" character varying,
                "categoryId" integer NOT NULL,
                CONSTRAINT "UQ_subcategory_entity_name" UNIQUE ("name"),
                CONSTRAINT "PK_subcategory_entity_id" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "subcategory_entity"
            ADD CONSTRAINT "FK_subcategory_entity_categoryId"
            FOREIGN KEY ("categoryId") REFERENCES "category_entity"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subcategory_entity" DROP CONSTRAINT "FK_subcategory_entity_categoryId"`);
        await queryRunner.query(`DROP TABLE "subcategory_entity"`);
    }
}
