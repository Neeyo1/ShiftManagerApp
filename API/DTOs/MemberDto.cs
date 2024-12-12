namespace API.DTOs;

public class MemberDto
{
    public int Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastActive { get; set; }
    public required string Role { get; set; }
    public int? DepartmentId { get; set; }
}
