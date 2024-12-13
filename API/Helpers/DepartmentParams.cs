namespace API.Helpers;

public class DepartmentParams : PaginationParams
{
    public int? DepartmentId { get; set; }
    public string? Name { get; set; }
    public string OrderBy { get; set; } = "name";
}
