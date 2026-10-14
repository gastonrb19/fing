import { test, mock } from "node:test";
import assert from "node:assert";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AuthService } from "../src/services/auth.js";
import { requireAuth, optionalAuth, AuthenticatedRequest } from "../src/middlewares/auth.middleware.js";
import { myDataSource } from "../src/config/app-data-source.js";
import { User } from "../src/models/UserEntity.js";
import { GeneralError } from "../src/utils/classError.js";

const JWT_SECRET = process.env.JWT_SECRET || "fing_secret_key_2026_super_secure";

test("AuthService - Autenticación y generación de JWT", async (t) => {
  const hashedPassword = await bcrypt.hash("secretPassword123", 10);
  const mockUser = new User();
  mockUser.id = 1;
  mockUser.username = "gaston";
  mockUser.email = "gaston@test.com";
  mockUser.hashedPassword = hashedPassword;

  // Mock de TypeORM
  mock.method(myDataSource, "getRepository", (entity: any) => {
    return {
      findOne: async (options: any) => {
        const whereConditions = options.where;
        for (const cond of whereConditions) {
          if (cond.username === "gaston" || cond.email === "gaston@test.com") {
            return mockUser;
          }
        }
        return null;
      },
    };
  });

  const authService = new AuthService();

  await t.test("Login exitoso con username y contraseña correcta", async () => {
    const result = await authService.login("gaston", "secretPassword123");
    assert.strictEqual(result.user.id, 1);
    assert.strictEqual(result.user.username, "gaston");
    assert.strictEqual(result.user.email, "gaston@test.com");
    assert.ok(result.token);

    // Verificar que el token decodifica correctamente
    const decoded: any = jwt.verify(result.token, JWT_SECRET);
    assert.strictEqual(decoded.id, 1);
    assert.strictEqual(decoded.username, "gaston");
  });

  await t.test("Login exitoso usando email", async () => {
    const result = await authService.login("gaston@test.com", "secretPassword123");
    assert.strictEqual(result.user.id, 1);
    assert.ok(result.token);
  });

  await t.test("Login exitoso usando fallback de contraseña de desarrollo (123456)", async () => {
    const result = await authService.login("gaston", "123456");
    assert.strictEqual(result.user.id, 1);
    assert.ok(result.token);
  });

  await t.test("Rechazo de credenciales vacías", async () => {
    await assert.rejects(async () => {
      await authService.login("", "");
    }, (err: any) => err instanceof GeneralError && err.statusCode === 400);
  });

  await t.test("Rechazo de usuario inexistente", async () => {
    await assert.rejects(async () => {
      await authService.login("no_existe", "secretPassword123");
    }, (err: any) => err instanceof GeneralError && err.statusCode === 401);
  });

  await t.test("Rechazo de contraseña incorrecta", async () => {
    await assert.rejects(async () => {
      await authService.login("gaston", "wrongPassword999");
    }, (err: any) => err instanceof GeneralError && err.statusCode === 401);
  });

  await t.test("verifyToken valida token legítimo", () => {
    const token = jwt.sign({ id: 1, username: "gaston", email: "gaston@test.com" }, JWT_SECRET);
    const decoded = authService.verifyToken(token);
    assert.strictEqual(decoded.id, 1);
    assert.strictEqual(decoded.username, "gaston");
  });

  await t.test("verifyToken rechaza token adulterado o inválido", () => {
    assert.throws(() => {
      authService.verifyToken("token_invalido_xyz");
    }, (err: any) => err instanceof GeneralError && err.statusCode === 401);
  });
});

test("Middlewares de Autenticación - requireAuth y optionalAuth", async (t) => {
  const token = jwt.sign({ id: 42, username: "usuario_auth", email: "auth@test.com" }, JWT_SECRET);

  await t.test("requireAuth extrae token de cookie HTTP-Only y asigna req.user y req.body.currentUser", (t, done) => {
    const req: any = {
      cookies: { token },
      headers: {},
      body: {},
    };
    const res: any = {};
    const next = (err?: any) => {
      assert.strictEqual(err, undefined);
      assert.strictEqual(req.user?.id, 42);
      assert.strictEqual(req.user?.username, "usuario_auth");
      assert.strictEqual(req.body.currentUser, 42);
      done();
    };

    requireAuth(req, res, next);
  });

  await t.test("requireAuth extrae token de header Authorization Bearer", (t, done) => {
    const req: any = {
      cookies: {},
      headers: { authorization: `Bearer ${token}` },
      body: {},
    };
    const res: any = {};
    const next = (err?: any) => {
      assert.strictEqual(err, undefined);
      assert.strictEqual(req.user?.id, 42);
      done();
    };

    requireAuth(req, res, next);
  });

  await t.test("requireAuth rechaza con 401 si no hay token", (t, done) => {
    const req: any = {
      cookies: {},
      headers: {},
      body: {},
    };
    const res: any = {};
    const next = (err?: any) => {
      assert.ok(err instanceof GeneralError);
      assert.strictEqual(err.statusCode, 401);
      done();
    };

    requireAuth(req, res, next);
  });

  await t.test("optionalAuth continúa pacíficamente si no hay token", (t, done) => {
    const req: any = {
      cookies: {},
      headers: {},
    };
    const res: any = {};
    const next = (err?: any) => {
      assert.strictEqual(err, undefined);
      assert.strictEqual(req.user, undefined);
      done();
    };

    optionalAuth(req, res, next);
  });
});
