import { TableColumn } from "typeorm";
export class AddSoftDeleteToCategories1783565882611 {
    name = "AddSoftDeleteToCategories1783565882611";
    async up(queryRunner) {
        await queryRunner.addColumn("CATEGORY", new TableColumn({
            name: "deletedAt",
            type: "timestamp",
            isNullable: true,
        }));
        await queryRunner.addColumn("SUBCATEGORY", new TableColumn({
            name: "deletedAt",
            type: "timestamp",
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("SUBCATEGORY", "deletedAt");
        await queryRunner.dropColumn("CATEGORY", "deletedAt");
    }
}
//# sourceMappingURL=1783565882611-AddSoftDeleteToCategories.js.map