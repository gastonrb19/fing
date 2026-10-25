import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddSoftDeleteToCategories1783565882611 implements MigrationInterface {
    name = "AddSoftDeleteToCategories1783565882611";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "CATEGORY",
            new TableColumn({
                name: "deletedAt",
                type: "timestamp",
                isNullable: true,
            })
        );

        await queryRunner.addColumn(
            "SUBCATEGORY",
            new TableColumn({
                name: "deletedAt",
                type: "timestamp",
                isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("SUBCATEGORY", "deletedAt");
        await queryRunner.dropColumn("CATEGORY", "deletedAt");
    }
}
