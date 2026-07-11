"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const sequelize_1 = require("sequelize");
// This module constructs the connection, so it must load configuration itself.
// Static ES module imports are evaluated before a caller's dotenv.config() runs.
dotenv_1.default.config({ quiet: true });
const sequelize = new sequelize_1.Sequelize({
    dialect: "sqlite",
    storage: process.env.DB_STORAGE ?? "./database.sqlite",
    logging: false,
});
exports.default = sequelize;
