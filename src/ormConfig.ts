import { DataSource } from "typeorm";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

// Adjust the entity path for development and production
const entitiesPath =
  process.env.NODE_ENV === "production"
    ? path.join(__dirname, "/dist/entities/*.js") // Point to compiled JS files in production
    : path.join(__dirname, "/src/entities/*.ts"); // Point to TypeScript files in development

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [entitiesPath], // Dynamically set the entities path
  synchronize: process.env.NODE_ENV !== "production", // Don't sync in production
  logging: false,
});
