import {
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import sequelize from "../config/database.js";

export const EMPLOYMENT_STATUSES = ["active", "inactive", "on_leave", "terminated"] as const;
export type EmploymentStatus = (typeof EMPLOYMENT_STATUSES)[number];

/**
 * A single employee's current compensation record. Salary is stored as a
 * DECIMAL rather than a floating point number to preserve monetary precision.
 */
class Employee extends Model<
  InferAttributes<Employee>,
  InferCreationAttributes<Employee>
> {
  declare id: CreationOptional<number>;
  declare employeeNumber: string;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare department: string;
  declare country: string;
  declare currency: string;
  declare salary: string;
  declare employmentStatus: EmploymentStatus;
  declare hireDate: string;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

Employee.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    employeeNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: { notEmpty: true },
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: true },
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: true },
    },
    email: {
      type: DataTypes.STRING(254),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: true },
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: true },
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      validate: { is: /^[A-Z]{3}$/ },
    },
    salary: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: { min: 0 },
    },
    employmentStatus: {
      type: DataTypes.ENUM(...EMPLOYMENT_STATUSES),
      allowNull: false,
      defaultValue: "active",
    },
    hireDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
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
  },
);

export default Employee;
