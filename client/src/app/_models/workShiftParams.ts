export class WorkShiftParams{
    workShiftId?: number;
    employeeId?: number;
    dateFrom = "";
    dateTo = "";
    status = "going";
    orderBy = "oldest";
    pageNumber = 1;
    pageSize = 10;
}
