export class EmployeeParams{
    employeeId?: number;
    departmentId?: number;
    firstName = "";
    lastName = "";
    status = "active";
    orderBy = "lastName";
    pageNumber = 1;
    pageSize = 10;
}
