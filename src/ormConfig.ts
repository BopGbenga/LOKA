import { DataSource } from "typeorm";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [__dirname + "/entities/*.ts"], // Ensure this points to the right directory
  synchronize: true, // Set to false in production
  logging: false,
});
