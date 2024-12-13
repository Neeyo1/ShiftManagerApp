namespace API.Helpers;

public class MemberParams : PaginationParams
{
    public int? MemberId { get; set; }
    public int? DepartmentId { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string Status { get; set; } = "all";
    public string OrderBy { get; set; } = "lastName";
}
