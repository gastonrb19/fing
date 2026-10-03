import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddRejectedColumn1783565882609 implements MigrationInterface {
    name = 'AddRejectedColumn1783565882609'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("INSTALLMENTUSERPAYMENT", new TableColumn({
            name: "rejected",
            type: "boolean",
            isNullable: false,
            default: false
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("INSTALLMENTUSERPAYMENT", "rejected");
    }
}
