namespace API.Helpers;

public class WorkRecordParams : PaginationParams
{
    public int WorkRecordId { get; set; }
    public string? DateFrom { get; set; }
    public string? DateTo { get; set; }
    public int EmployeeId { get; set; }
    public string Status { get; set; } = "all";
    public string OrderBy { get; set; } = "oldest";
}
