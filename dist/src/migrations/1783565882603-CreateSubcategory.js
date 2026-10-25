export class CreateSubcategory1783565882603 {
    name = "CreateSubcategory1783565882603";
    async up(queryRunner) {
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
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "SUBCATEGORY" DROP CONSTRAINT "FK_SUBCATEGORY_categoryId"`);
        await queryRunner.query(`DROP TABLE "SUBCATEGORY"`);
    }
}
//# sourceMappingURL=1783565882603-CreateSubcategory.js.map