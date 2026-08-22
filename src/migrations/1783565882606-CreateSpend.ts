import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSpend1783565882606 implements MigrationInterface {
    name = "CreateSpend1783565882606";

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Create TYPESPEND table
        await queryRunner.query(`
            CREATE TABLE "TYPESPEND" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "PK_TYPESPEND_id" PRIMARY KEY ("id")
            )
        `);

        // Seed TYPESPEND
        await queryRunner.query(`
            INSERT INTO "TYPESPEND" ("name") VALUES ('Ingreso'), ('Gasto')
        `);

        // 2. Create SPEND table
        await queryRunner.query(`
            CREATE TABLE "SPEND" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "amount" double precision NOT NULL,
                "minDayToPayment" integer NOT NULL,
                "maxDayToPayment" integer,
                "totalInstallment" integer,
                "startPayment" date,
                "createDate" TIMESTAMP NOT NULL DEFAULT now(),
                "updateDate" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" integer NOT NULL,
                "subcategoryId" integer NOT NULL,
                "fkTypeSpend" integer NOT NULL,
                CONSTRAINT "PK_SPEND_id" PRIMARY KEY ("id")
            )
        `);

        // 3. Create PLANNEDINSTALLMENT table
        await queryRunner.query(`
            CREATE TABLE "PLANNEDINSTALLMENT" (
                "idPI" character varying NOT NULL,
                "amount" double precision NOT NULL,
                "expirationDate" date NOT NULL,
                "availableDate" date NOT NULL,
                "spendId" integer NOT NULL,
                CONSTRAINT "PK_PLANNEDINSTALLMENT_idPI" PRIMARY KEY ("idPI")
            )
        `);

        // 4. Create INSTALLMENTUSERPAYMENT table
        await queryRunner.query(`
            CREATE TABLE "INSTALLMENTUSERPAYMENT" (
                "idPayment" uuid NOT NULL,
                "accepted" boolean NOT NULL,
                "paidAmount" double precision NOT NULL,
                "paymentDone" boolean NOT NULL,
                "plannedInstallmentId" character varying NOT NULL,
                "userId" integer,
                CONSTRAINT "PK_INSTALLMENTUSERPAYMENT_idPayment" PRIMARY KEY ("idPayment")
            )
        `);

        // Constraints for SPEND
        await queryRunner.query(`
            ALTER TABLE "SPEND"
            ADD CONSTRAINT "FK_SPEND_userId"
            FOREIGN KEY ("userId") REFERENCES "USERS"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "SPEND"
            ADD CONSTRAINT "FK_SPEND_subcategoryId"
            FOREIGN KEY ("subcategoryId") REFERENCES "SUBCATEGORY"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "SPEND"
            ADD CONSTRAINT "FK_SPEND_fkTypeSpend"
            FOREIGN KEY ("fkTypeSpend") REFERENCES "TYPESPEND"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        // Constraints for PLANNEDINSTALLMENT
        await queryRunner.query(`
            ALTER TABLE "PLANNEDINSTALLMENT"
            ADD CONSTRAINT "FK_PLANNEDINSTALLMENT_spendId"
            FOREIGN KEY ("spendId") REFERENCES "SPEND"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        // Constraints for INSTALLMENTUSERPAYMENT
        await queryRunner.query(`
            ALTER TABLE "INSTALLMENTUSERPAYMENT"
            ADD CONSTRAINT "FK_INSTALLMENTUSERPAYMENT_plannedInstallmentId"
            FOREIGN KEY ("plannedInstallmentId") REFERENCES "PLANNEDINSTALLMENT"("idPI")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "INSTALLMENTUSERPAYMENT"
            ADD CONSTRAINT "FK_INSTALLMENTUSERPAYMENT_userId"
            FOREIGN KEY ("userId") REFERENCES "USERS"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "INSTALLMENTUSERPAYMENT" DROP CONSTRAINT "FK_INSTALLMENTUSERPAYMENT_userId"`);
        await queryRunner.query(`ALTER TABLE "INSTALLMENTUSERPAYMENT" DROP CONSTRAINT "FK_INSTALLMENTUSERPAYMENT_plannedInstallmentId"`);
        await queryRunner.query(`ALTER TABLE "PLANNEDINSTALLMENT" DROP CONSTRAINT "FK_PLANNEDINSTALLMENT_spendId"`);
        await queryRunner.query(`ALTER TABLE "SPEND" DROP CONSTRAINT "FK_SPEND_fkTypeSpend"`);
        await queryRunner.query(`ALTER TABLE "SPEND" DROP CONSTRAINT "FK_SPEND_subcategoryId"`);
        await queryRunner.query(`ALTER TABLE "SPEND" DROP CONSTRAINT "FK_SPEND_userId"`);
        await queryRunner.query(`DROP TABLE "INSTALLMENTUSERPAYMENT"`);
        await queryRunner.query(`DROP TABLE "PLANNEDINSTALLMENT"`);
        await queryRunner.query(`DROP TABLE "SPEND"`);
        await queryRunner.query(`DROP TABLE "TYPESPEND"`);
    }
}
