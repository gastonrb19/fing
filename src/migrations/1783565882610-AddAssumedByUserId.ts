import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddAssumedByUserId1783565882610 implements MigrationInterface {
    name = 'AddAssumedByUserId1783565882610'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("INSTALLMENTUSERPAYMENT", new TableColumn({
            name: "assumedByUserId",
            type: "int",
            isNullable: true
        }));

        await queryRunner.createForeignKey("INSTALLMENTUSERPAYMENT", new TableForeignKey({
            columnNames: ["assumedByUserId"],
            referencedColumnNames: ["id"],
            referencedTableName: "USERS",
            onDelete: "SET NULL"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("INSTALLMENTUSERPAYMENT");
        const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf("assumedByUserId") !== -1);
        if (foreignKey) {
            await queryRunner.dropForeignKey("INSTALLMENTUSERPAYMENT", foreignKey);
        }
        await queryRunner.dropColumn("INSTALLMENTUSERPAYMENT", "assumedByUserId");
    }
}
