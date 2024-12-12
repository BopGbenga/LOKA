"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [path_1.default.join(__dirname, "/entities/*.js")],
    synchronize: false,
    logging: false,
    migrations: ["src/migration/**/*.ts"],
    // migrations: [path.join(__dirname, "/migrations/*.ts")],
    migrationsTableName: "migrations_history", // Adds a custom table name for tracking migrations
    ssl: {
        rejectUnauthorized: false, // Set to false if using self-signed certificates
    },
});
