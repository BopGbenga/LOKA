"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResetCode = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateResetCode = () => {
    return crypto_1.default.randomInt(100000, 1000000).toString();
};
exports.generateResetCode = generateResetCode;
