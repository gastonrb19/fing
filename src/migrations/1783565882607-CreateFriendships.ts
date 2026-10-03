import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateFriendships1783565882607 implements MigrationInterface {
    name = 'CreateFriendships1783565882607'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create ENUM type for the request status
        await queryRunner.query(`CREATE TYPE "FRIENDREQUEST_STATUS_ENUM" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED')`);

        // FRIENDREQUEST Table
        await queryRunner.createTable(new Table({
            name: "FRIENDREQUEST",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "senderId", type: "int" },
                { name: "receiverId", type: "int" },
                { name: "status", type: "enum", enumName: "FRIENDREQUEST_STATUS_ENUM", default: "'PENDING'" },
                { name: "createdAt", type: "timestamp", default: "now()" },
                { name: "updatedAt", type: "timestamp", default: "now()" }
            ]
        }), true);

        // FRIENDSHIP Table
        await queryRunner.createTable(new Table({
            name: "FRIENDSHIP",
            columns: [
                { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
                { name: "userId", type: "int" },
                { name: "friendId", type: "int" },
                { name: "createdAt", type: "timestamp", default: "now()" }
            ]
        }), true);

        // Constraints for FRIENDREQUEST
        await queryRunner.createForeignKey("FRIENDREQUEST", new TableForeignKey({
            columnNames: ["senderId"],
            referencedColumnNames: ["id"],
            referencedTableName: "USERS",
            onDelete: "CASCADE"
        }));
        await queryRunner.createForeignKey("FRIENDREQUEST", new TableForeignKey({
            columnNames: ["receiverId"],
            referencedColumnNames: ["id"],
            referencedTableName: "USERS",
            onDelete: "CASCADE"
        }));

        // Constraints for FRIENDSHIP
        await queryRunner.createForeignKey("FRIENDSHIP", new TableForeignKey({
            columnNames: ["userId"],
            referencedColumnNames: ["id"],
            referencedTableName: "USERS",
            onDelete: "CASCADE"
        }));
        await queryRunner.createForeignKey("FRIENDSHIP", new TableForeignKey({
            columnNames: ["friendId"],
            referencedColumnNames: ["id"],
            referencedTableName: "USERS",
            onDelete: "CASCADE"
        }));
        
        // Ensure no duplicate friendships are saved (Optional but highly recommended)
        await queryRunner.query(`ALTER TABLE "FRIENDSHIP" ADD CONSTRAINT "UQ_FRIENDSHIP_USER_FRIEND" UNIQUE("userId", "friendId")`);
        // Ensure only one pending/accepted request per pair
        await queryRunner.query(`ALTER TABLE "FRIENDREQUEST" ADD CONSTRAINT "UQ_FRIENDREQUEST_SENDER_RECEIVER" UNIQUE("senderId", "receiverId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("FRIENDSHIP");
        await queryRunner.dropTable("FRIENDREQUEST");
        await queryRunner.query(`DROP TYPE "FRIENDREQUEST_STATUS_ENUM"`);
    }
}
