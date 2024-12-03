namespace API.DTOs;

public class EmployeeDto
{
    public int Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public bool IsActive { get; set; }
    public int DepartmentId { get; set; }
}
