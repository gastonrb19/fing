export class CreateUser1783565882601 {
    name = "CreateUser1783565882601";
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "USERS" (
                "id" SERIAL NOT NULL,
                "username" character varying NOT NULL,
                "email" character varying NOT NULL,
                "hashedPassword" character varying NOT NULL,
                "phone" character varying,
                CONSTRAINT "UQ_USERS_username" UNIQUE ("username"),
                CONSTRAINT "UQ_USERS_email" UNIQUE ("email"),
                CONSTRAINT "UQ_USERS_phone" UNIQUE ("phone"),
                CONSTRAINT "PK_USERS_id" PRIMARY KEY ("id")
            )
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "USERS"`);
    }
}
//# sourceMappingURL=1783565882601-CreateUser.js.map