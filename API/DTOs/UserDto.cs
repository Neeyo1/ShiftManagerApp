namespace API.DTOs;

public class UserDto
{
    public int Id { get; set; }
    public required string Username { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Token { get; set; }
    public int? DepartmentId { get; set; }
}
