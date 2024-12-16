import { DataSource } from "typeorm";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [path.join(__dirname, "/entities/*.js")],
  synchronize: false,
  logging: false,
  migrations: ["src/migration/**/*.ts"],
  migrationsTableName: "migrations_history",
  ssl: {
    rejectUnauthorized: false, // Set to false if using self-signed certificates
  },
});
