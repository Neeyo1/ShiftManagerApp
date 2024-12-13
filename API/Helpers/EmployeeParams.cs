using System;

namespace API.Helpers;

public class EmployeeParams : PaginationParams
{
    public int? EmployeeId { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public int? DepartmentId { get; set; }
    public string Status { get; set; } = "active";
    public string OrderBy { get; set; } = "lastName";
}
