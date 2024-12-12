"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserTable1733958638362 = void 0;
const typeorm_1 = require("typeorm");
class CreateUserTable1733958638362 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create the users table
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "firstname",
                        type: "varchar",
                        length: "100",
                    },
                    {
                        name: "lastname",
                        type: "varchar",
                        length: "100",
                    },
                    {
                        name: "username",
                        type: "varchar",
                        length: "100",
                        isUnique: true,
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "100",
                        isUnique: true,
                    },
                    {
                        name: "password",
                        type: "varchar",
                        length: "255",
                        isNullable: true,
                    },
                    {
                        name: "isVerified",
                        type: "boolean",
                        default: false,
                    },
                    {
                        name: "role",
                        type: "enum",
                        enum: ["buyer", "artisan"],
                        isNullable: true,
                    },
                    {
                        name: "resetToken",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "tokenExpiry",
                        type: "timestamp",
                        isNullable: true,
                    },
                    {
                        name: "googleId",
                        type: "varchar",
                        isNullable: true,
                        isUnique: true,
                    },
                    {
                        name: "artisanProfileId",
                        type: "int",
                        isNullable: true,
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        isNullable: true,
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],
            }), true);
            // Create foreign key for artisanProfile
            yield queryRunner.createForeignKey("users", new typeorm_1.TableForeignKey({
                columnNames: ["artisanProfileId"],
                referencedColumnNames: ["id"],
                referencedTableName: "artisan_profile", // Ensure this matches the ArtisanProfile table name
                onDelete: "CASCADE",
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropTable("users");
        });
    }
}
exports.CreateUserTable1733958638362 = CreateUserTable1733958638362;
