"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMPLOYMENT_STATUSES = void 0;
const sequelize_1 = require("sequelize");
const database_js_1 = __importDefault(require("../config/database.js"));
exports.EMPLOYMENT_STATUSES = ["active", "inactive", "on_leave", "terminated"];
/**
 * A single employee's current compensation record. Salary is stored as a
 * DECIMAL rather than a floating point number to preserve monetary precision.
 */
class Employee extends sequelize_1.Model {
}
Employee.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    employeeNumber: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: { notEmpty: true },
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        validate: { notEmpty: true },
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        validate: { notEmpty: true },
    },
    email: {
        type: sequelize_1.DataTypes.STRING(254),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    },
    department: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        validate: { notEmpty: true },
    },
    country: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        validate: { notEmpty: true },
    },
    currency: {
        type: sequelize_1.DataTypes.STRING(3),
        allowNull: false,
        validate: { is: /^[A-Z]{3}$/ },
    },
    salary: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: false,
        validate: { min: 0 },
    },
    employmentStatus: {
        type: sequelize_1.DataTypes.ENUM(...exports.EMPLOYMENT_STATUSES),
        allowNull: false,
        defaultValue: "active",
    },
    hireDate: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    sequelize: database_js_1.default,
    modelName: "Employee",
    tableName: "employees",
    underscored: true,
    indexes: [
        { fields: ["department"] },
        { fields: ["country"] },
        { fields: ["employment_status"] },
        { fields: ["salary"] },
        { fields: ["last_name", "first_name"] },
    ],
});
exports.default = Employee;
