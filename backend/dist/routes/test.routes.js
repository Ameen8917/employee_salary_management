"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Salary Management API is running."
    });
});
exports.default = router;
