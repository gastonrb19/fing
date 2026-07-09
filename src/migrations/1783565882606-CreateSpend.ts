import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSpend1783565882606 implements MigrationInterface {
    name = "CreateSpend1783565882606";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "spend_entity" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "amount" double precision NOT NULL,
                "createDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updateDate" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" integer NOT NULL,
                "subcategoryId" integer NOT NULL,
                CONSTRAINT "PK_spend_entity_id" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "spend_entity"
            ADD CONSTRAINT "FK_spend_entity_userId"
            FOREIGN KEY ("userId") REFERENCES "user"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "spend_entity"
            ADD CONSTRAINT "FK_spend_entity_subcategoryId"
            FOREIGN KEY ("subcategoryId") REFERENCES "subcategory_entity"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "spend_entity" DROP CONSTRAINT "FK_spend_entity_subcategoryId"`);
        await queryRunner.query(`ALTER TABLE "spend_entity" DROP CONSTRAINT "FK_spend_entity_userId"`);
        await queryRunner.query(`DROP TABLE "spend_entity"`);
    }
}
