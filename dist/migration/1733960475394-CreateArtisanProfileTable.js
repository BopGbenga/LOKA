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
exports.CreateArtisanProfileTable1733958638363 = void 0;
const typeorm_1 = require("typeorm");
class CreateArtisanProfileTable1733958638363 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
                name: "artisan_profile",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "businessName",
                        type: "varchar",
                    },
                    {
                        name: "businessCategory",
                        type: "varchar",
                    },
                    {
                        name: "businessLocation",
                        type: "varchar",
                    },
                    {
                        name: "businessDescription",
                        type: "text",
                        isNullable: true,
                    },
                    {
                        name: "contactInformation",
                        type: "varchar",
                    },
                    {
                        name: "userId",
                        type: "int",
                        isUnique: true,
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
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropTable("artisan_profile");
        });
    }
}
exports.CreateArtisanProfileTable1733958638363 = CreateArtisanProfileTable1733958638363;
