import { test, mock } from "node:test";
import assert from "node:assert";
import { UserService } from "../src/services/user.js";
import { User } from "../src/models/UserEntity.js";
import { myDataSource } from "../src/config/app-data-source.js";

test("UserService CRUD operations", async () => {
    const savedUsers: User[] = [];

    mock.method(myDataSource, "getRepository", (entity: any) => {
        return {
            findOneBy: async (query: any) => {
                if (query.username === "existing_user") {
                    const u = new User();
                    u.username = "existing_user";
                    return u;
                }
                if (query.id === 1) {
                    const u = new User();
                    u.id = 1;
                    u.username = "gaston";
                    return u;
                }
                return null;
            },
            find: async () => {
                return savedUsers;
            },
            save: async (user: User) => {
                if (!user.id) {
                    user.id = savedUsers.length + 1;
                }
                savedUsers.push(user);
                return user;
            }
        };
    });

    const userService = new UserService();

    // 1. Test create user
    const dto = {
        username: "new_user",
        email: "new@test.com",
        hashedPassword: "password123",
        phone: "123456789"
    };

    const newUser = await userService.create(dto);
    assert.strictEqual(newUser.username, "new_user");
    assert.strictEqual(newUser.email, "new@test.com");
    assert.ok(newUser.hashedPassword);
    assert.notStrictEqual(newUser.hashedPassword, "password123"); // Password must be hashed

    // 2. Test create duplicate user fails
    await assert.rejects(async () => {
        await userService.create({
            username: "existing_user",
            email: "other@test.com",
            hashedPassword: "password",
            phone: "11111111"
        });
    }, /already exist/);

    // 3. Test findOneById
    const user = await userService.findOneById(1);
    assert.strictEqual(user.username, "gaston");

    // 4. Test findOneById non-existent throws
    await assert.rejects(async () => {
        await userService.findOneById(999);
    }, /not found/i);

    console.log("¡Prueba de UserService aprobada con éxito!");
});
