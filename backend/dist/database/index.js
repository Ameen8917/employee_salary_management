"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = initializeDatabase;
const database_js_1 = __importDefault(require("../config/database.js"));
require("../models/index.js");
async function initializeDatabase() {
    try {
        await database_js_1.default.authenticate();
        console.log("✅ Database connected");
        await database_js_1.default.sync();
        console.log("✅ Database synchronized");
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
}
