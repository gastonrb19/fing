import { test } from "node:test";
import assert from "node:assert";
import { validateBody } from "../src/middlewares/validation.js";
import { createUserSchema } from "../src/schemas/user.schema.js";
import { GeneralError } from "../src/utils/classError.js";

test("validateBody middleware validates correct data and throws GeneralError on invalid data", () => {
    const middleware = validateBody(createUserSchema);
    
    // Test valid data
    const reqValid: any = {
        body: {
            username: "gaston",
            email: "gaston@test.com",
            hashedPassword: "password123",
            phone: "987654321"
        }
    };
    const res: any = {};
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    middleware(reqValid, res, next);
    assert.strictEqual(nextCalled, true);
    assert.strictEqual(reqValid.body.username, "gaston");

    // Test invalid data (violates schemas)
    const reqInvalid: any = {
        body: {
            username: "g", // too short
            email: "not-an-email",
            hashedPassword: "123", // too short
            phone: "1" // too short
        }
    };

    assert.throws(() => {
        middleware(reqInvalid, res, next);
    }, (err: any) => {
        assert.ok(err instanceof GeneralError);
        assert.strictEqual(err.statusCode, 400);
        assert.strictEqual(err.code, "BAD_REQUEST");
        assert.match(err.message, /Validation Error/);
        return true;
    });
});
