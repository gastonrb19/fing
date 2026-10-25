import { DataSource } from "typeorm";
if (typeof process.loadEnvFile === 'function') {
    try {
        process.loadEnvFile();
    }
    catch {
        // Ignore if .env is missing
    }
}
const isSupabase = process.env.DB_HOST?.includes("supabase.co") ||
    process.env.DB_HOST?.includes("pooler.supabase.com") ||
    process.env.DATABASE_URL?.includes("supabase.co") ||
    process.env.DATABASE_URL?.includes("pooler.supabase.com");
const useSSL = process.env.DB_SSL === "true" || isSupabase;
export const myDataSource = new DataSource({
    type: "postgres",
    ...(process.env.DATABASE_URL
        ? { url: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST || "localhost",
            port: Number(process.env.DB_PORT) || 5432,
            username: process.env.DB_USER || "postgres",
            password: process.env.DB_PASS || "postgres",
            database: process.env.DB_NAME || "postgres",
        }),
    ssl: useSSL ? { rejectUnauthorized: false } : false,
    entities: [import.meta.dirname + "/../models/**/*{.js,.ts}"],
    migrations: [import.meta.dirname + "/../migrations/**/*{.js,.ts}"],
    migrationsTableName: "migrations",
    migrationsRun: process.env.RUN_MIGRATIONS === "true",
    logging: process.env.NODE_ENV !== "production",
    synchronize: process.env.DB_SYNC === "true" || process.env.NODE_ENV !== "production",
});
//# sourceMappingURL=app-data-source.js.map