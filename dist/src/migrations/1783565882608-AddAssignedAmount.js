import { TableColumn } from "typeorm";
export class AddAssignedAmount1783565882608 {
    name = 'AddAssignedAmount1783565882608';
    async up(queryRunner) {
        await queryRunner.addColumn("INSTALLMENTUSERPAYMENT", new TableColumn({
            name: "assignedAmount",
            type: "double precision",
            isNullable: false,
            default: 0
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("INSTALLMENTUSERPAYMENT", "assignedAmount");
    }
}
//# sourceMappingURL=1783565882608-AddAssignedAmount.js.map