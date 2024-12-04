namespace API.Helpers;

public class WorkShiftParams : PaginationParams
{
    public int WorkShiftId { get; set; }
    public string? Date { get; set; }
    public string? DateFrom { get; set; }
    public string? DateTo { get; set; }
    public int EmployeeId { get; set; }
    public string OrderBy { get; set; } = "oldest";
}
