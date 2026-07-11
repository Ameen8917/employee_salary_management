"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ quiet: true });
const app_js_1 = __importDefault(require("./app.js"));
const index_js_1 = require("./database/index.js");
const PORT = process.env.PORT || 5000;
async function bootstrap() {
    await (0, index_js_1.initializeDatabase)();
    app_js_1.default.listen(PORT, () => {
        console.log(`🚀 Server running on ${PORT}`);
    });
}
bootstrap();
