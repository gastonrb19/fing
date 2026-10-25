export class CreateIncomeTables1783565882612 {
    name = "CreateIncomeTables1783565882612";
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "CATEGORY_INCOME" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "description" character varying,
                "deletedAt" TIMESTAMP,
                CONSTRAINT "UQ_CATEGORY_INCOME_name" UNIQUE ("name"),
                CONSTRAINT "PK_CATEGORY_INCOME_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "INCOME" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "amount" double precision NOT NULL,
                "comentary" character varying,
                "date" date NOT NULL,
                "isPayed" boolean NOT NULL DEFAULT false,
                "createDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updateDate" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" integer NOT NULL,
                "categoryIncomeId" integer NOT NULL,
                CONSTRAINT "PK_INCOME_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "INCOME"
            ADD CONSTRAINT "FK_INCOME_userId"
            FOREIGN KEY ("userId") REFERENCES "USERS"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "INCOME"
            ADD CONSTRAINT "FK_INCOME_categoryIncomeId"
            FOREIGN KEY ("categoryIncomeId") REFERENCES "CATEGORY_INCOME"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "INCOME" DROP CONSTRAINT "FK_INCOME_categoryIncomeId"`);
        await queryRunner.query(`ALTER TABLE "INCOME" DROP CONSTRAINT "FK_INCOME_userId"`);
        await queryRunner.query(`DROP TABLE "INCOME"`);
        await queryRunner.query(`DROP TABLE "CATEGORY_INCOME"`);
    }
}
//# sourceMappingURL=1783565882612-CreateIncomeTables.js.map