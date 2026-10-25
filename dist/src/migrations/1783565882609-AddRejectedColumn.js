import { TableColumn } from "typeorm";
export class AddRejectedColumn1783565882609 {
    name = 'AddRejectedColumn1783565882609';
    async up(queryRunner) {
        await queryRunner.addColumn("INSTALLMENTUSERPAYMENT", new TableColumn({
            name: "rejected",
            type: "boolean",
            isNullable: false,
            default: false
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("INSTALLMENTUSERPAYMENT", "rejected");
    }
}
//# sourceMappingURL=1783565882609-AddRejectedColumn.js.map