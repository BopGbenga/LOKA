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
// Adjust the entity path for development and production
const entitiesPath = process.env.NODE_ENV === "production"
    ? path_1.default.join(__dirname, "/dist/entities/*.js") // Point to compiled JS files in production
    : path_1.default.join(__dirname, "/src/entities/*.ts"); // Point to TypeScript files in development
exports.AppDataSource = new typeorm_1.DataSource({
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
