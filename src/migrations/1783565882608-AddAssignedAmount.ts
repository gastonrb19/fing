import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddAssignedAmount1783565882608 implements MigrationInterface {
    name = 'AddAssignedAmount1783565882608'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("INSTALLMENTUSERPAYMENT", new TableColumn({
            name: "assignedAmount",
            type: "double precision",
            isNullable: false,
            default: 0
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("INSTALLMENTUSERPAYMENT", "assignedAmount");
    }
}
