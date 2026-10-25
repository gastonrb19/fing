export class CreateCategory1783565882602 {
    name = "CreateCategory1783565882602";
    async up(queryRunner) {
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
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "CATEGORY"`);
    }
}
//# sourceMappingURL=1783565882602-CreateCategory.js.map