export class WorkRecordParams{
    workRecordId?: number;
    employeeId?: number;
    dateFrom = "";
    dateTo = "";
    status = "all";
    orderBy = "oldest";
    pageNumber = 1;
    pageSize = 10;
}
