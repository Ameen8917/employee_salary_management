export type Employee = {
  id: number;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  country: string;
  currency: string;
  salary: number;
  employmentStatus: "active" | "inactive" | "on_leave" | "terminated";
  hireDate: string;
};
