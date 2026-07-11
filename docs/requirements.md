# Salary Management System - Requirements Document

## 1. Goal

Build a web-based Salary Management System that enables HR Managers to efficiently manage salary information for approximately 10,000 employees across multiple countries. The application replaces spreadsheet-based workflows with a centralized, searchable, and scalable platform while providing salary insights to support HR decision-making.

## 2. Problem Statement

Currently, employee salary information is maintained using spreadsheets, making it difficult to:

- Manage employee records efficiently
- Search and update salary information
- Generate salary-related insights
- Scale as the organization grows
- Maintain data consistency

The objective is to provide a centralized web application that simplifies salary management and reporting.

## 3. Target User

### Primary User: HR Manager

Responsibilities:

- Manage employee salary records
- Update salary information
- Search employees
- Analyze salary distribution
- Generate organizational salary insights

## 4. Scope (MVP)

### Employee Management

- Create employee
- View employee details
- Update employee information
- Delete employee

### Employee Listing

- Search employees
- Pagination
- Sorting
- Filtering by:
  - Department
  - Country
  - Salary Range
  - Employment Status

### Salary Dashboard

Display summary statistics:

- Total Employees
- Average Salary
- Highest Salary
- Lowest Salary
- Employees by Country
- Employees by Department

### Salary Analytics

- Average salary by department
- Average salary by country
- Top earning employees
- Lowest earning employees
- Salary distribution

### Data Seeding

Generate realistic data for approximately 10,000 employees for testing and demonstration.

## 5. Non-Functional Requirements

- Responsive web application
- Fast search and filtering
- Clean and maintainable architecture
- Proper validation
- Error handling
- Unit and integration tests
- RESTful API design
- Scalable project structure

## 6. Out of Scope

To keep the MVP focused, the following features will not be implemented:

- Authentication & Authorization
- Payroll processing
- Tax calculations
- Currency conversion
- Salary history/versioning
- Email notifications
- File import/export (CSV/Excel)
- Multi-tenant support
- Audit logging

These features are intentionally excluded to prioritize core salary management functionality within the assessment timeline.

## 7. Assumptions

- Employee salaries are stored in a single currency per employee.
- HR Managers have permission to perform all operations.
- Salary values are manually maintained.
- Employee records are unique.
- The application supports approximately 10,000 employee records without performance degradation.

## 8. Technical Decisions

### Backend

- Node.js
- Express
- TypeScript
- Sequelize ORM
- SQLite

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

### Testing

- Vitest
- Supertest

## 9. Success Criteria

The application should allow an HR Manager to:

- Efficiently manage employee salary records
- Quickly search and filter employees
- View meaningful salary insights
- Handle 10,000 employee records with good performance
- Use a clean, intuitive web interface
