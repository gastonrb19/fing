import {DataSource} from "typeorm";

export const myDataSource = new DataSource({ 
	type: "postgres",
	host: process.env.DB_HOST || "localhost",
	port: Number(process.env.DB_PORT) || 5432,
	username: process.env.DB_USER || "postgres",
	password: process.env.DB_PASS || "postgres",
	database: process.env.DB_NAME || "fing",
	entities: [import.meta.dirname + "/../models/**/*{.js,.ts}"],
	migrations: [import.meta.dirname + "/../migrations/**/*{.js,.ts}"],
	migrationsTableName: "migrations",
	logging: true,
	synchronize: true,
});
